import 'dotenv/config';
import https from 'https';

const {
  TESTRAIL_URL,
  TESTRAIL_USER,
  TESTRAIL_API_KEY,
  TESTRAIL_PROJECT_ID,
} = process.env;

function api(method, urlPath) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
    auth: `${TESTRAIL_USER}:${TESTRAIL_API_KEY}`,
  };
  
  return new Promise((resolve, reject) => {
    // Asegurar que la URL base termine con /
    const baseUrl = TESTRAIL_URL.replace(/\/+$/, '');
    // Construir URL completa - urlPath ya debe incluir 'api/v2/...'
    const fullUrl = `${baseUrl}/index.php?/${urlPath}`;
    
    console.log(`   [DEBUG] ${method} ${fullUrl}`);
    
    const req = https.request(fullUrl, opts, res => {
      let chunks = '';
      res.on('data', d => (chunks += d));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(chunks ? JSON.parse(chunks) : {});
          } catch (e) {
            resolve({});
          }
        } else {
          reject(new Error(`Status ${res.statusCode}: ${chunks}`));
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  console.log('🔍 TestRail Diagnostic Tool\n');
  console.log('=' .repeat(60));
  console.log('\n⚙️  Configuración detectada:');
  console.log(`   URL: ${TESTRAIL_URL}`);
  console.log(`   Usuario: ${TESTRAIL_USER}`);
  console.log(`   API Key: ${TESTRAIL_API_KEY ? '***' + TESTRAIL_API_KEY.slice(-4) : 'NO CONFIGURADA'}`);
  console.log(`   Proyecto ID: ${TESTRAIL_PROJECT_ID}`);
  
  try {
    // 1. Test de conexión básica - obtener información del proyecto directamente
    console.log('\n1️⃣  Probando conexión básica...');
    const project = await api('GET', `api/v2/get_project/${TESTRAIL_PROJECT_ID}`);
    console.log(`   ✅ Conexión exitosa!`);
    
    // 2. Información del proyecto
    console.log('\n2️⃣  Información del proyecto...');
    console.log(`   📋 Nombre: ${project.name}`);
    console.log(`   🔢 ID: ${project.id}`);
    console.log(`   📅 Anuncio: ${project.announcement || 'Sin anuncio'}`);
    console.log(`   🔓 Público: ${project.is_completed ? 'No' : 'Sí'}`);
    console.log(`   ✅ Completado: ${project.is_completed ? 'Sí' : 'No'}`);
    
    const suiteMode = project.suite_mode === 1 ? 'Single Suite (modo simple)' :
                      project.suite_mode === 2 ? 'Single Suite + Baselines' :
                      project.suite_mode === 3 ? 'Multiple Suites (modo avanzado)' :
                      'Desconocido';
    console.log(`   🏗️  Modo de Suite: ${suiteMode}`);
    
    // 3. Suites (si aplica)
    if (project.suite_mode !== 1) {
      console.log('\n3️⃣  Suites del proyecto...');
      try {
        const suitesResponse = await api('GET', `api/v2/get_suites/${TESTRAIL_PROJECT_ID}`);
        const suites = suitesResponse.suites || suitesResponse || [];
        
        if (suites.length > 0) {
          suites.forEach((s, idx) => {
            console.log(`   ${idx + 1}. Suite ID ${s.id}: ${s.name}`);
            console.log(`      Descripción: ${s.description || 'Sin descripción'}`);
          });
          console.log(`\n   💡 Usa uno de estos Suite IDs en TESTRAIL_SUITE_ID`);
        } else {
          console.log('   ℹ️  No hay suites definidas');
        }
      } catch (err) {
        console.log('   ⚠️  No se pudieron obtener suites:', err.message);
      }
    } else {
      console.log('\n3️⃣  Suites: No aplica (proyecto en Single Suite Mode)');
      console.log('   💡 Deja TESTRAIL_SUITE_ID vacío o no lo uses');
    }
    
    // 4. Secciones
    console.log('\n4️⃣  Secciones del proyecto...');
    try {
      const sectionsResponse = await api('GET', `api/v2/get_sections/${TESTRAIL_PROJECT_ID}`);
      const sections = sectionsResponse.sections || sectionsResponse || [];
      
      if (sections.length > 0) {
        console.log(`   📁 Total de secciones: ${sections.length}`);
        sections.slice(0, 5).forEach(s => {
          console.log(`   • Sección ID ${s.id}: ${s.name}`);
        });
        if (sections.length > 5) {
          console.log(`   ... y ${sections.length - 5} más`);
        }
      } else {
        console.log('   ℹ️  No hay secciones definidas (se creará una por defecto)');
      }
    } catch (err) {
      console.log('   ℹ️  No se pudieron obtener secciones');
    }
    
    // 5. Casos de prueba (primeros 10)
    console.log('\n5️⃣  Casos de prueba (muestra de los primeros 10)...');
    try {
      const casesResponse = await api('GET', `api/v2/get_cases/${TESTRAIL_PROJECT_ID}&limit=10`);
      const cases = casesResponse.cases || casesResponse || [];
      
      if (cases.length > 0) {
        console.log(`   📝 Total aproximado: ${casesResponse.size || cases.length}`);
        console.log(`   🔢 Mostrando primeros ${cases.length}:\n`);
        
        cases.forEach(c => {
          console.log(`   • C${c.id}: ${c.title}`);
          console.log(`     Suite: ${c.suite_id || 'N/A'} | Sección: ${c.section_id || 'N/A'} | Tipo: ${c.type_id}`);
        });
        
        console.log(`\n   💡 Tus test cases deben usar IDs como [C${cases[0].id}]`);
        console.log(`   💡 El siguiente ID disponible probablemente sea C${(casesResponse.size || cases.length) + 1}`);
      } else {
        console.log('   ⚠️  No se encontraron casos de prueba');
        console.log('   💡 Primero crea algunos test cases en TestRail');
        console.log(`   💡 Los IDs comenzarán desde C1`);
      }
    } catch (err) {
      console.log(`   ❌ Error obteniendo casos: ${err.message}`);
    }
    
    // 6. Runs recientes
    console.log('\n6️⃣  Test Runs recientes (últimos 5)...');
    try {
      const runsResponse = await api('GET', `api/v2/get_runs/${TESTRAIL_PROJECT_ID}&limit=5`);
      const runs = runsResponse.runs || runsResponse || [];
      
      if (runs.length > 0) {
        runs.forEach((r, idx) => {
          const total = r.passed_count + r.failed_count + r.blocked_count + r.retest_count + r.untested_count;
          console.log(`   ${idx + 1}. Run ID ${r.id}: ${r.name}`);
          console.log(`      URL: ${TESTRAIL_URL}index.php?/runs/view/${r.id}`);
          console.log(`      Casos: ${total} | ✅ ${r.passed_count} | ❌ ${r.failed_count} | ⏭️ ${r.untested_count}`);
        });
      } else {
        console.log('   ℹ️  No hay test runs previos');
      }
    } catch (err) {
      console.log(`   ⚠️  No se pudieron obtener runs: ${err.message}`);
    }
    
    // 7. Verificar usuario actual
    console.log('\n7️⃣  Información del usuario...');
    try {
      const users = await api('GET', `api/v2/get_users`);
      const currentUser = users.users?.find(u => u.email === TESTRAIL_USER) || users.find(u => u.email === TESTRAIL_USER);
      
      if (currentUser) {
        console.log(`   👤 Usuario: ${currentUser.name}`);
        console.log(`   📧 Email: ${currentUser.email}`);
        console.log(`   🔑 Role ID: ${currentUser.role_id} ${currentUser.role_id === 1 ? '(Admin)' : currentUser.role_id === 3 ? '(User)' : ''}`);
        console.log(`   ✅ Activo: ${currentUser.is_active ? 'Sí' : 'No'}`);
      }
    } catch (err) {
      console.log(`   ℹ️  No se pudo obtener info del usuario`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Diagnóstico completado exitosamente\n');
    
    console.log('📝 RESUMEN DE CONFIGURACIÓN RECOMENDADA:');
    console.log(`   TESTRAIL_URL="${TESTRAIL_URL}"`);
    console.log(`   TESTRAIL_USER="${TESTRAIL_USER}"`);
    console.log(`   TESTRAIL_API_KEY="${TESTRAIL_API_KEY}"`);
    console.log(`   TESTRAIL_PROJECT_ID="${TESTRAIL_PROJECT_ID}"`);
    if (project.suite_mode === 1) {
      console.log(`   TESTRAIL_SUITE_ID=""  # Déjalo vacío para Single Suite`);
    } else {
      console.log(`   TESTRAIL_SUITE_ID="<elige un suite de arriba>"`);
    }
    console.log(`   TESTRAIL_RUN_PREFIX="Frontend"`);
    
    console.log('\n📊 SIGUIENTE PASO:');
    console.log('   Ejecuta: node scripts/create-test-cases.mjs');
    console.log('   Para ver qué test cases necesitas crear en TestRail');
    
  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    console.error('\n🔧 Posibles soluciones:');
    console.error('   1. Verifica que TESTRAIL_URL sea correcta (debe terminar con /)');
    console.error('   2. Confirma que TESTRAIL_USER es tu email de TestRail');
    console.error('   3. Verifica que TESTRAIL_API_KEY sea válida (Settings > API Keys)');
    console.error('   4. Asegúrate que TESTRAIL_PROJECT_ID sea correcto');
    console.error('   5. Verifica que tu usuario tenga permisos en el proyecto');
    console.error('\n🔍 Detalles del error:');
    console.error(err.stack || err);
    process.exit(1);
  }
})();