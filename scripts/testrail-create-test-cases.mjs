import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { parseStringPromise } from 'xml2js';

const {
  TESTRAIL_URL,
  TESTRAIL_USER,
  TESTRAIL_API_KEY,
  TESTRAIL_PROJECT_ID,
  TESTRAIL_SUITE_ID
} = process.env;

const REPORTS_DIR = path.resolve('reports');

function api(method, urlPath, body) {
  const data = body ? JSON.stringify(body) : null;
  const opts = {
    method,
    headers: { 
      'Content-Type': 'application/json', 
      'Content-Length': data ? Buffer.byteLength(data) : 0 
    },
    auth: `${TESTRAIL_USER}:${TESTRAIL_API_KEY}`,
  };
  
  return new Promise((resolve, reject) => {
    const fullUrl = `${TESTRAIL_URL.replace(/\/+$/, '')}/index.php?/${urlPath}`;
    
    const req = https.request(fullUrl, opts, res => {
      let chunks = '';
      res.on('data', d => (chunks += d));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(chunks ? JSON.parse(chunks) : {});
        } else {
          console.error(`[ERROR] ${method} ${urlPath} - ${res.statusCode}: ${chunks}`);
          reject(new Error(`API ${urlPath} ${res.statusCode}: ${chunks}`));
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function listReports() {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  return fs.readdirSync(REPORTS_DIR)
    .filter(f => /^junit.*\.xml$/i.test(f))
    .map(f => path.join(REPORTS_DIR, f));
}

const ID_REGEXES = [/\[C(\d+)\]/i, /\bC-? ?(\d+)\b/i];
const getCaseId = (txt = '') => {
  for (const r of ID_REGEXES) { 
    const m = txt.match(r); 
    if (m) return Number(m[1]); 
  }
  return null;
};

async function parseOne(file) {
  const xml = fs.readFileSync(file, 'utf8');
  const parsed = await parseStringPromise(xml, { explicitArray: false, mergeAttrs: true });
  const suitesRaw = parsed.testsuites?.testsuite ?? parsed.testsuite ?? [];
  const suites = Array.isArray(suitesRaw) ? suitesRaw : [suitesRaw].filter(Boolean);

  const testCases = [];
  for (const suite of suites) {
    const arr = suite?.testcase ?? [];
    const tcs = Array.isArray(arr) ? arr : [arr].filter(Boolean);
    for (const tc of tcs) {
      const name = tc.name || '';
      const cls = tc.classname || '';
      const case_id = getCaseId(name) || getCaseId(`${cls} ${name}`) || getCaseId(cls);
      
      if (case_id) {
        // Extraer título limpio sin el [C####]
        const title = name.replace(/\[C\d+\]\s*/, '');
        testCases.push({
          id: case_id,
          title: title || `Test Case ${case_id}`,
          suite_name: suite.name || 'Default Suite',
          class_name: cls
        });
      }
    }
  }
  return testCases;
}

async function getSections(projectId, suiteId) {
  try {
    let url = `api/v2/get_sections/${projectId}`;
    if (suiteId) url += `&suite_id=${suiteId}`;
    
    const response = await api('GET', url);
    return response.sections || response || [];
  } catch (err) {
    console.log('   ℹ️  No se pudieron obtener secciones (puede ser normal)');
    return [];
  }
}

async function createSection(projectId, suiteId, name) {
  try {
    const payload = {
      name,
      description: 'Sección creada automáticamente'
    };
    if (suiteId) payload.suite_id = Number(suiteId);
    
    const section = await api('POST', `api/v2/add_section/${projectId}`, payload);
    console.log(`   ✅ Sección creada: ${section.name} (ID: ${section.id})`);
    return section;
  } catch (err) {
    console.error(`   ❌ Error creando sección: ${err.message}`);
    return null;
  }
}

(async () => {
  try {
    console.log('🏗️  TestRail Test Case Creator\n');
    console.log('Este script NO creará los test cases automáticamente.');
    console.log('En su lugar, generará un reporte de qué necesitas crear.\n');
    
    // Recolectar todos los test cases de los XMLs
    const files = listReports();
    let allCases = [];
    
    for (const f of files) {
      const cases = await parseOne(f);
      allCases = allCases.concat(cases);
    }
    
    // Eliminar duplicados por ID
    const uniqueCases = Array.from(
      new Map(allCases.map(c => [c.id, c])).values()
    ).sort((a, b) => a.id - b.id);
    
    console.log(`📊 Se encontraron ${uniqueCases.length} test cases únicos\n`);
    
    // Verificar cuáles ya existen
    console.log('🔍 Verificando qué test cases ya existen en TestRail...\n');
    
    const existing = [];
    const missing = [];
    
    for (const testCase of uniqueCases) {
      try {
        const existing_case = await api('GET', `api/v2/get_case/${testCase.id}`);
        existing.push({...testCase, testrail_title: existing_case.title});
        console.log(`   ✅ C${testCase.id} ya existe: ${existing_case.title}`);
      } catch (err) {
        missing.push(testCase);
        console.log(`   ❌ C${testCase.id} no existe: ${testCase.title}`);
      }
      
      // Pausa para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📈 Resumen:`);
    console.log(`   ✅ Existen: ${existing.length}`);
    console.log(`   ❌ Faltan: ${missing.length}`);
    
    if (missing.length === 0) {
      console.log('\n🎉 ¡Todos los test cases ya existen! Puedes ejecutar el upload script.');
      return;
    }
    
    // Generar reporte de casos faltantes
    console.log('\n' + '='.repeat(80));
    console.log('📋 TEST CASES QUE NECESITAS CREAR EN TESTRAIL\n');
    
    // Agrupar por suite
    const bySuite = {};
    missing.forEach(tc => {
      if (!bySuite[tc.suite_name]) {
        bySuite[tc.suite_name] = [];
      }
      bySuite[tc.suite_name].push(tc);
    });
    
    Object.keys(bySuite).sort().forEach(suiteName => {
      console.log(`\n📁 ${suiteName}`);
      console.log('   ' + '-'.repeat(76));
      
      bySuite[suiteName].forEach(tc => {
        console.log(`   C${tc.id.toString().padStart(4, '0')}: ${tc.title}`);
        if (tc.class_name) {
          console.log(`          Clase: ${tc.class_name}`);
        }
      });
    });
    
    // Generar CSV para importación
    console.log('\n' + '='.repeat(80));
    console.log('📄 GENERANDO ARCHIVO CSV PARA IMPORTACIÓN...\n');
    
    const csvLines = ['Case ID,Title,Section,Type,Priority'];
    missing.forEach(tc => {
      const escapedTitle = `"${tc.title.replace(/"/g, '""')}"`;
      const section = tc.suite_name || 'Default';
      csvLines.push(`C${tc.id},${escapedTitle},${section},Automated,Medium`);
    });
    
    const csvContent = csvLines.join('\n');
    fs.writeFileSync('missing_test_cases.csv', csvContent);
    
    console.log('✅ Archivo generado: missing_test_cases.csv');
    console.log('\n📝 INSTRUCCIONES PARA CREAR LOS TEST CASES:\n');
    console.log('Opción 1 - Crear manualmente en TestRail:');
    console.log('   1. Ve a tu proyecto en TestRail');
    console.log('   2. Crea cada test case con el ID específico (C0294, C0295, etc.)');
    console.log('   3. IMPORTANTE: TestRail asigna IDs automáticamente, así que:');
    console.log('      - Si TestRail asigna C1, C2, C3... necesitarás llegar hasta C0294');
    console.log('      - O mejor: cambia los IDs en tus tests para usar los que asigna TestRail\n');
    
    console.log('Opción 2 - Ajustar tus tests (RECOMENDADO):');
    console.log('   1. Ejecuta este script de diagnóstico: node testrail-diagnostic.mjs');
    console.log('   2. Mira qué IDs están disponibles en tu proyecto (ej: C1, C2, C3...)');
    console.log('   3. Actualiza tus tests para usar esos IDs en lugar de C0294, C0295, etc.\n');
    
    console.log('Opción 3 - Script de creación automática:');
    console.log('   Este script puede intentar crear los casos automáticamente.');
    console.log('   ⚠️  ADVERTENCIA: TestRail asigna IDs secuencialmente.');
    console.log('   Los IDs creados NO coincidirán con tus [C0294], [C0295], etc.');
    console.log('   Solo útil si luego actualizas tus tests con los nuevos IDs.\n');
    
    // Preguntar si quiere intentar crear automáticamente
    console.log('¿Deseas que el script intente crear los test cases automáticamente?');
    console.log('Esto creará ' + missing.length + ' test cases, pero con IDs diferentes a los actuales.');
    console.log('\nPara continuar, ejecuta:');
    console.log('   node create-test-cases.mjs --create\n');
    
    if (process.argv.includes('--create')) {
      console.log('\n🚀 Creando test cases automáticamente...\n');
      
      // Obtener o crear sección
      const sections = await getSections(TESTRAIL_PROJECT_ID, TESTRAIL_SUITE_ID);
      let sectionId = null;
      
      if (sections.length > 0) {
        console.log('📁 Secciones existentes:');
        sections.forEach(s => console.log(`   - ${s.name} (ID: ${s.id})`));
        sectionId = sections[0].id; // Usar la primera sección
        console.log(`\n   Usando sección: ${sections[0].name}\n`);
      } else {
        console.log('📁 Creando nueva sección...');
        const newSection = await createSection(TESTRAIL_PROJECT_ID, TESTRAIL_SUITE_ID, 'Automated Tests');
        sectionId = newSection?.id;
      }
      
      const created = [];
      const failed = [];
      
      for (const testCase of missing) {
        try {
          const payload = {
            title: testCase.title,
            type_id: 1, // Automated
            priority_id: 2, // Medium
            custom_automation_type: 0, // None
          };
          
          if (sectionId) payload.section_id = sectionId;
          if (TESTRAIL_SUITE_ID) payload.suite_id = Number(TESTRAIL_SUITE_ID);
          
          let url = `api/v2/add_case/${sectionId || TESTRAIL_PROJECT_ID}`;
          const newCase = await api('POST', url, payload);
          
          created.push(newCase);
          console.log(`   ✅ Creado C${newCase.id}: ${newCase.title}`);
          console.log(`      (Original: C${testCase.id})`);
          
          // Pausa para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (err) {
          failed.push({testCase, error: err.message});
          console.error(`   ❌ Error creando C${testCase.id}: ${err.message}`);
        }
      }
      
      console.log(`\n📊 Resultado de creación:`);
      console.log(`   ✅ Creados: ${created.length}`);
      console.log(`   ❌ Fallidos: ${failed.length}`);
      
      if (created.length > 0) {
        console.log('\n📋 MAPEO DE IDs (actualiza tus tests con estos nuevos IDs):\n');
        console.log('ID Original → ID en TestRail');
        console.log('-'.repeat(40));
        
        missing.forEach((tc, idx) => {
          if (created[idx]) {
            console.log(`C${tc.id.toString().padStart(4, '0')} → C${created[idx].id}`);
          }
        });
        
        // Generar archivo de mapeo
        const mappingLines = ['Original ID,TestRail ID,Title'];
        missing.forEach((tc, idx) => {
          if (created[idx]) {
            mappingLines.push(`C${tc.id},C${created[idx].id},"${tc.title.replace(/"/g, '""')}"`);
          }
        });
        
        fs.writeFileSync('id_mapping.csv', mappingLines.join('\n'));
        console.log('\n✅ Mapeo guardado en: id_mapping.csv');
      }
    }
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
})();