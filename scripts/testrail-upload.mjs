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
  TESTRAIL_SUITE_ID,
  TESTRAIL_RUN_PREFIX
} = process.env;

const REPORTS_DIR = path.resolve('reports');
const BATCH = 300;

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
    console.log(`[API] ${method} ${urlPath}`);
    
    const req = https.request(fullUrl, opts, res => {
      let chunks = '';
      res.on('data', d => (chunks += d));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(chunks ? JSON.parse(chunks) : {});
        } else {
          console.error(`[API ERROR] ${urlPath} - Status: ${res.statusCode}`);
          console.error(`[API ERROR] Response: ${chunks}`);
          reject(new Error(`API ${urlPath} ${res.statusCode}: ${chunks}`));
        }
      });
    });
    
    req.on('error', (err) => {
      console.error(`[REQUEST ERROR] ${urlPath}:`, err.message);
      reject(err);
    });
    
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

function statusFrom(tc) { 
  if (tc.failure || tc.error) return 5; 
  if (tc.skipped) return 2; 
  return 1; 
}

async function parseOne(file) {
  const xml = fs.readFileSync(file, 'utf8');
  const parsed = await parseStringPromise(xml, { explicitArray: false, mergeAttrs: true });
  const suitesRaw = parsed.testsuites?.testsuite ?? parsed.testsuite ?? [];
  const suites = Array.isArray(suitesRaw) ? suitesRaw : [suitesRaw].filter(Boolean);

  const results = [];
  for (const suite of suites) {
    const arr = suite?.testcase ?? [];
    const tcs = Array.isArray(arr) ? arr : [arr].filter(Boolean);
    for (const tc of tcs) {
      const name = tc.name || '';
      const cls = tc.classname || '';
      const case_id =
        getCaseId(name) ||
        getCaseId(`${cls} ${name}`) ||
        getCaseId(cls);
      if (!case_id) continue;
      const status_id = statusFrom(tc);
      const comment = [
        `File: ${path.basename(file)}`,
        `Class: ${cls}`,
        tc.failure ? `Failure: ${tc.failure._ || tc.failure}` : '',
        tc.error ? `Error: ${tc.error._ || tc.error}` : '',
        tc.skipped ? `Skipped` : ''
      ].filter(Boolean).join('\n');
      results.push({ case_id, status_id, comment });
    }
  }
  return results;
}

async function collect() {
  const files = listReports();
  let results = [];
  for (const f of files) {
    const parsed = await parseOne(f);
    results = results.concat(parsed);
  }
  const unique = [...new Set(results.map(r => r.case_id))];
  console.log(`📁 Archivos: ${files.length} | Resultados: ${results.length} | Casos únicos: ${unique.length}`);
  return { files, results, unique };
}

async function getProjectInfo() {
  try {
    const project = await api('GET', `api/v2/get_project/${TESTRAIL_PROJECT_ID}`);
    console.log(`\nProyecto: ${project.name}`);
    console.log(`   Modo: ${project.suite_mode === 1 ? 'Single Suite' : project.suite_mode === 2 ? 'Single Suite + Baselines' : 'Multiple Suites'}`);
    return project;
  } catch (err) {
    console.error('Error obteniendo información del proyecto:', err.message);
    throw err;
  }
}

async function getSuites() {
  try {
    const suites = await api('GET', `api/v2/get_suites/${TESTRAIL_PROJECT_ID}`);
    if (suites.length > 0) {
      console.log(`\nSuites disponibles:`);
      suites.forEach(s => console.log(`   - Suite ID ${s.id}: ${s.name}`));
      return suites;
    }
    return [];
  } catch (err) {
    console.log('Proyecto en modo Single Suite (no hay endpoint de suites)');
    return [];
  }
}

async function validateCaseIds(ids) {
  const valid = [];
  const invalid = [];
  const chunkSize = 10;
  
  console.log(`\nValidando ${ids.length} case IDs...`);
  
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const promises = chunk.map(id =>
      api('GET', `api/v2/get_case/${id}`)
        .then(obj => {
          console.log(`C${id} válido: ${obj.title}`);
          valid.push(id);
        })
        .catch(err => {
          console.log(`C${id} inválido o no existe`);
          invalid.push(id);
        })
    );
    await Promise.all(promises);
    
    // Pequeña pausa entre chunks para evitar rate limiting
    if (i + chunkSize < ids.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return { valid, invalid };
}

async function createRunWith(caseIds) {
  const payload = {
    name: `${TESTRAIL_RUN_PREFIX || 'Local Run'} - ${new Date().toISOString()}`,
    include_all: false,
    case_ids: caseIds
  };
  
  // Solo agregar suite_id si está definido y no es vacío
  if (TESTRAIL_SUITE_ID && TESTRAIL_SUITE_ID.trim() !== '') {
    payload.suite_id = Number(TESTRAIL_SUITE_ID);
    console.log(`\nCreando run con Suite ID: ${payload.suite_id}`);
  } else {
    console.log(`\nCreando run sin Suite ID (Single Suite Mode)`);
  }
  
  console.log(`Nombre: ${payload.name}`);
  console.log(`Casos: ${caseIds.length}`);
  
  return api('POST', `api/v2/add_run/${TESTRAIL_PROJECT_ID}`, payload);
}

(async () => {
  try {
    console.log('TestRail Upload Script\n');
    console.log('Configuración:');
    console.log(`URL: ${TESTRAIL_URL}`);
    console.log(`Usuario: ${TESTRAIL_USER}`);
    console.log(`Proyecto ID: ${TESTRAIL_PROJECT_ID}`);
    console.log(`Suite ID: ${TESTRAIL_SUITE_ID || '(vacío - Single Suite Mode)'}`);
    
    // Verificar proyecto
    await getProjectInfo();
    await getSuites();
    
    // Recolectar resultados
    const { results, unique } = await collect();
    
    if (unique.length === 0) {
      console.error('\nNo se hallaron IDs [C####] en los reports.');
      return;
    }

    console.log(`\nCase IDs encontrados: ${unique.slice(0, 20).join(', ')}${unique.length > 20 ? '...' : ''}`);

    // Validar case_ids
    const { valid, invalid } = await validateCaseIds(unique);

    if (invalid.length) {
      console.warn(`\nIDs inválidos (${invalid.length}): ${invalid.slice(0, 20).join(', ')}${invalid.length > 20 ? '...' : ''}`);
    }
    
    if (valid.length === 0) {
      console.error('\nNo hay case_ids válidos. Verifica que los C#### existan en tu proyecto TestRail.');
      console.log('\nSugerencias:');
      console.log('1. Verifica que los test cases existen en TestRail');
      console.log('2. Confirma que estás usando el Project ID correcto');
      console.log('3. Si usas Multiple Suites, verifica el Suite ID');
      return;
    }

    console.log(`\nCases válidos: ${valid.length}`);

    // Filtrar resultados a los válidos
    const filtered = results.filter(r => valid.includes(r.case_id));

    // Crear run
    const run = await createRunWith(valid);
    console.log(`\nRun creado: ${run.name}`);
    console.log(`Run ID: ${run.id}`);
    console.log(`URL: ${TESTRAIL_URL}index.php?/runs/view/${run.id}`);

    // Subir resultados en batches
    console.log(`\nSubiendo ${filtered.length} resultados...`);
    for (let i = 0; i < filtered.length; i += BATCH) {
      const chunk = filtered.slice(i, i + BATCH);
      await api('POST', `api/v2/add_results_for_cases/${run.id}`, { results: chunk });
      console.log(`Batch ${Math.floor(i / BATCH) + 1}: ${chunk.length} resultados`);
    }
    
    console.log(`\n¡Completado exitosamente!`);
    console.log(`Run ID: ${run.id}`);
    console.log(`Casos en run: ${valid.length}`);
    console.log(`Resultados enviados: ${filtered.length}`);
    console.log(`URL: ${TESTRAIL_URL}index.php?/runs/view/${run.id}`);
    
  } catch (e) {
    console.error('\nError fatal:', e.message);
    if (e.stack) {
      console.error('\nStack trace:');
      console.error(e.stack);
    }
    process.exit(1);
  }
})();