const Mocha = require('mocha');
const path = require('path');

const mocha = new Mocha({ timeout: 60000 });
[
  'smoke.spec.cjs',
  'error_cases.spec.cjs',
  'navigation.spec.cjs',
  'pages.spec.cjs',
  'extras.spec.cjs',
].forEach(f => mocha.addFile(path.join(__dirname, 'specs', f)));

mocha.run(failures => process.exitCode = failures ? 1 : 0);