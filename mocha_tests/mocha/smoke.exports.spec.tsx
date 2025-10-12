import { expect } from "chai";

import * as FormsSvc from "../../src/features/forms-list/services/forms-services.ts";
import * as Types from "../../src/features/forms-list/services/types.ts";

describe("Smoke de exports", () => {
  it("services exporta api", () => {
    expect(FormsSvc.api).to.exist;
  });

  it("types módulo existe", () => {
    expect(Types).to.exist;
    expect(Types).to.be.an("object");
  });

  it("services tiene métodos axios", () => {
    expect(FormsSvc.api.get).to.be.a("function");
    expect(FormsSvc.api.post).to.be.a("function");
    expect(FormsSvc.api.put).to.be.a("function");
    expect(FormsSvc.api.delete).to.be.a("function");
  });

  it("api tiene configuración base", () => {
    expect(FormsSvc.api.defaults).to.exist;
    expect(FormsSvc.api.defaults.baseURL).to.be.a("string");
  });
});
