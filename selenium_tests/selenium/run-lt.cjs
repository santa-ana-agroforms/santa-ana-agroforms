const Mocha = require('mocha');
const path = require('path');

if (!process.env.LT_USERNAME || !process.env.LT_ACCESS_KEY) {
  console.error('Faltan LT_USERNAME / LT_ACCESS_KEY');
  process.exit(1);
}

const mocha = new Mocha({ timeout: 60000 });
[
  'smoke.spec.js',
  'navigation.spec.js',
  'pages.spec.js',
].forEach(f => mocha.addFile(path.join(__dirname,'specs',f)));

mocha.run(failures => process.exitCode = failures ? 1 : 0);