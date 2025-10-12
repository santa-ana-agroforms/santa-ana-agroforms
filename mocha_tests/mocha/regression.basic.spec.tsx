import { expect } from "chai";

describe("Regresión básica", () => {
  it("Math y utilidades", () => {
    expect(Number.isFinite(42)).to.equal(true);
  });
  it("Strings", () => {
    expect("Santa Ana".includes("Ana")).to.equal(true);
  });
});
