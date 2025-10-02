const mock = require("mock-require");
const path = require("path");

const realFormsServices = path.resolve(
  process.cwd(),
  "src/features/forms-list/services/forms-services"
);

const stubFormsServices = path.resolve(
  process.cwd(),
  "mocha_tests/stub-forms-services.cjs"
);

mock(realFormsServices, require(stubFormsServices));
