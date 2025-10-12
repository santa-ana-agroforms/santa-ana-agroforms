const jsdomGlobal = require("jsdom-global");

// Inicializa jsdom antes de cargar polyfills y stubs
const cleanup = jsdomGlobal("", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

// Stubs/registries de assets y polyfills
require("./register-assets.cjs"); // .png/.css/etc
require("./setup-jsdom.cjs");

module.exports = {
  mochaHooks: {
    afterAll() {
      try {
        if (global.window && Array.isArray(global.window.___mqls)) {
          for (const mql of global.window.___mqls) {
            try {
              mql.removeEventListener?.("change", () => {});
            } catch {}
            try {
              mql.removeListener?.(() => {});
            } catch {}
          }
          global.window.___mqls = [];
        }
      } catch {}

      try {
        cleanup();
      } catch {}
    },
  },
};
