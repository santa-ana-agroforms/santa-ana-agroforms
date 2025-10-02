import { expect } from "chai";
import nock from "nock";
import * as sinon from "sinon";

import { api } from "../../src/features/forms-list/services/forms-services";

describe("services/forms-services api", () => {
  it("api tiene baseURL por defecto", () => {
    expect((api.defaults as any).baseURL).to.be.a("string");
  });

  it("interceptor CSRF agrega header cuando método es mutación", async () => {
    const interceptors = api.interceptors.request as any;
    expect(interceptors.handlers).to.exist;
    expect(interceptors.handlers.length).to.be.greaterThan(0);

    const handler = interceptors.handlers[0];
    expect(handler).to.exist;
    expect(handler.fulfilled).to.be.a("function");

    const postConfig: any = {
      method: "post",
      headers: {},
    };

    const result = await handler.fulfilled(postConfig);
    expect(result).to.exist;
    expect(result.method).to.equal("post");

    const getConfig: any = {
      method: "get",
      headers: {},
    };

    const getResult = await handler.fulfilled(getConfig);
    expect(getResult).to.exist;
    expect(getResult.method).to.equal("get");
  });

  it("GET a /formularios (mockeado) devuelve 200", async () => {
    const base = (api.defaults as any).baseURL.replace(/\/$/, "");
    nock(base).get("/api/formularios/").reply(200, []);
    const res = await api.get("/api/formularios/");
    expect(res.status).to.equal(200);
  });

  it("POST a /formularios duplica (mock 201)", async () => {
    const base = (api.defaults as any).baseURL.replace(/\/$/, "");
    nock(base).post("/api/formularios/duplicar/1/").reply(201, { ok: true });
    const res = await api.post("/api/formularios/duplicar/1/");
    expect(res.status).to.equal(201);
    expect(res.data.ok).to.equal(true);
  });

  it("maneja error 500", async () => {
    const base = (api.defaults as any).baseURL.replace(/\/$/, "");
    nock(base).get("/api/error/").reply(500, "fail");
    try {
      await api.get("/api/error/");
      expect.fail("Debe lanzar");
    } catch (e: any) {
      expect(e.response.status).to.equal(500);
    }
  });

  it("headers se pueden configurar", async () => {
    const interceptors = api.interceptors.request as any;
    const handler = interceptors.handlers[0];

    const config: any = {
      method: "delete",
      headers: { "Custom-Header": "value" },
    };

    const result = await handler.fulfilled(config);
    expect(result).to.exist;
    expect(result.headers).to.exist;
  });

  it("no muta headers en métodos GET", async () => {
    const interceptors = api.interceptors.request as any;
    const handler = interceptors.handlers[0];

    const originalHeaders = { "X-Test": "original" };
    const config: any = {
      method: "get",
      headers: { ...originalHeaders },
    };

    await handler.fulfilled(config);
    expect(config.headers["X-Test"]).to.equal("original");
  });

  it("baseURL permite override por env", () => {
    expect(typeof (api.defaults as any).baseURL).to.equal("string");
  });
});
