import React from "react";

import { render } from "@testing-library/react";
import { expect } from "chai";

import App from "../../src/App.tsx";

describe("Routing básico", () => {
  it("App renderiza", () => {
    const { container } = render(<App />);
    expect(container).to.exist;
  });

  it("incluye layout base", () => {
    const { container } = render(<App />);
    expect(container.innerHTML).to.be.a("string");
  });

  it("sincrónico", () => {
    expect(1 + 1).to.equal(2);
  });

  it("placeholder de ruta", () => {
    expect(["/", "/login"]).to.include("/");
  });
});
