const Mocha = require('mocha');
const path = require('path');

const mocha = new Mocha({ timeout: 30000 });
[
  'smoke.spec.cjs',
  'navigation.spec.cjs',
  'pages.spec.cjs',
].forEach(f => mocha.addFile(path.join(__dirname,'specs',f)));

mocha.run(failures => process.exitCode = failures ? 1 : 0);
