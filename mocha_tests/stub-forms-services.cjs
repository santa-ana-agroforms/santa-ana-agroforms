// Mock completo para forms-services que evita cualquier inicialización de axios
const mockAxiosInstance = {
  defaults: {
    baseURL: process.env.VITE_API_BASE_URL || "http://localhost:5173",
    headers: {
      common: {},
      get: {},
      post: {},
      put: {},
      delete: {},
    },
  },
  interceptors: {
    request: {
      use: (fulfilled, rejected) => {
        // Retorna un id para simular el registro
        return 0;
      },
      eject: () => {},
      handlers: [
        {
          fulfilled: async (config) => {
            // Simula el interceptor CSRF
            if (
              config.method &&
              ["post", "put", "patch", "delete"].includes(
                config.method.toLowerCase()
              )
            ) {
              if (config.headers && config.headers.set) {
                config.headers.set("X-CSRFToken", "mock-csrf-token");
              }
            }
            return config;
          },
        },
      ],
    },
    response: {
      use: () => {},
      eject: () => {},
    },
  },
  get: async (url, config) => ({
    data: [],
    status: 200,
    statusText: "OK",
    headers: {},
    config: config || {},
  }),
  post: async (url, data, config) => ({
    data: { ok: true },
    status: 201,
    statusText: "Created",
    headers: {},
    config: config || {},
  }),
  put: async (url, data, config) => ({
    data: { ok: true },
    status: 200,
    statusText: "OK",
    headers: {},
    config: config || {},
  }),
  delete: async (url, config) => ({
    data: null,
    status: 204,
    statusText: "No Content",
    headers: {},
    config: config || {},
  }),
  patch: async (url, data, config) => ({
    data: { ok: true },
    status: 200,
    statusText: "OK",
    headers: {},
    config: config || {},
  }),
  request: async (config) => ({
    data: {},
    status: 200,
    statusText: "OK",
    headers: {},
    config: config || {},
  }),
};

module.exports = {
  __esModule: true,
  default: {},
  api: mockAxiosInstance,
  listarFormularios: async () => [],
  obtenerFormulario: async () => null,
  crearFormulario: async () => ({ ok: true }),
  actualizarFormulario: async () => ({ ok: true }),
  eliminarFormulario: async () => ({ ok: true }),
  duplicarFormulario: async () => ({ ok: true }),
};
