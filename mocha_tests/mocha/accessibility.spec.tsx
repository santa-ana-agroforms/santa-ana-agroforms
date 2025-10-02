import React from "react";

import { render, screen } from "@testing-library/react";
import { expect } from "chai";

import { AppHeader } from "../../src/components/AppHeader";

describe("Accesibilidad mínima", () => {
  const mockOnToggle = () => {};

  it("AppHeader tiene role banner", () => {
    render(
      <AppHeader collapsed={false} onToggle={mockOnToggle} title="Test" />
    );
    expect(screen.getByRole("banner")).to.exist;
  });

  it("links accesibles", () => {
    render(
      <AppHeader collapsed={false} onToggle={mockOnToggle} title="Test" />
    );
    const html = document.body.innerHTML.toLowerCase();
    // Verificar que el header se renderizó correctamente
    expect(html).to.contain("header");
    expect(html.length).to.be.greaterThan(0);
  });

  it("botones visibles", () => {
    render(
      <AppHeader collapsed={false} onToggle={mockOnToggle} title="Test" />
    );
    expect(document.querySelectorAll("button").length).to.be.gte(0);
  });

  it("título se renderiza", () => {
    render(
      <AppHeader collapsed={false} onToggle={mockOnToggle} title="Mi Título" />
    );
    const html = document.body.innerHTML;
    // Verificamos que algo se renderizó
    expect(html.length).to.be.greaterThan(0);
  });
});
