import { expect } from "chai";
import nock from "nock";

import { api } from "../../src/features/forms-list/services/forms-services.ts";

describe("services/categories (vía axios api base)", () => {
  it("GET /api/categories/ 200", async () => {
    const base = (api.defaults as any).baseURL.replace(/\/$/, "");
    nock(base)
      .get("/api/categories/")
      .reply(200, [{ id: 1, nombre: "A" }]);
    const r = await api.get("/api/categories/");
    expect(r.status).to.equal(200);
    expect(r.data).to.be.an("array");
  });

  it("POST /api/categories/ 201", async () => {
    const base = (api.defaults as any).baseURL.replace(/\/$/, "");
    nock(base).post("/api/categories/").reply(201, { id: 1 });
    const r = await api.post("/api/categories/", { nombre: "X" });
    expect(r.status).to.equal(201);
  });

  it("PUT /api/categories/1 200", async () => {
    const base = (api.defaults as any).baseURL.replace(/\/$/, "");
    nock(base).put("/api/categories/1/").reply(200, { id: 1, nombre: "Z" });
    const r = await api.put("/api/categories/1/", { nombre: "Z" });
    expect(r.status).to.equal(200);
  });

  it("DELETE /api/categories/1 204", async () => {
    const base = (api.defaults as any).baseURL.replace(/\/$/, "");
    nock(base).delete("/api/categories/1/").reply(204);
    const r = await api.delete("/api/categories/1/");
    expect(r.status).to.equal(204);
  });

  it("404 controlado", async () => {
    const base = (api.defaults as any).baseURL.replace(/\/$/, "");
    nock(base).get("/api/categories/999/").reply(404);
    try {
      await api.get("/api/categories/999/");
      expect.fail("Debe fallar");
    } catch (e: any) {
      expect(e.response.status).to.equal(404);
    }
  });
});
