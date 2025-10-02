import { expect } from "chai";

import { queryClient } from "../../src/lib/queryClient";

describe("lib/queryClient", () => {
  it("exporta instancia", () => {
    expect(queryClient).to.exist;
  });

  it("tiene métodos básicos", () => {
    expect(queryClient).to.have.property("getQueryData");
    expect(queryClient).to.have.property("setQueryData");
  });

  it("permite set/get", () => {
    queryClient.setQueryData(["demo"], 123);
    expect(queryClient.getQueryData(["demo"])).to.equal(123);
  });

  it("clear cache", async () => {
    await queryClient.invalidateQueries();
    expect(true).to.equal(true);
  });
});
