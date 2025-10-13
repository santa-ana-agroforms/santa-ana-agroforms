import React from "react";

import { render, screen } from "@testing-library/react";
import { expect } from "chai";

import { renderWithProviders } from '../test-helpers';

import { AppHeader } from "../../src/components/AppHeader.tsx";
import { AppSidebar } from "../../src/components/AppSideBar.tsx";
import BaseModal from "../../src/components/BaseModal.tsx";
import CategoryTables from "../../src/components/CategoryTables";
import DeviceTables from "../../src/components/DeviceTables";
import FlatTables from "../../src/components/FlatTables";
import { LoginCard } from "../../src/components/LoginCard.tsx";
import UserTable from "../../src/components/UserTable";

describe("Components render", () => {
  it("AppHeader renderiza sin crashear", () => {
    render(<AppHeader collapsed={false} onToggle={() => {}} title="Demo" />);
    expect(screen.getByRole("banner")).to.exist;
  });

  it("AppSideBar renderiza menú", () => {
    renderWithProviders( // ⬅️ Cambiar a renderWithProviders
      <AppSidebar
        navigate={() => {}}
        collapsed={false}
        selectedKey="1"
        onSelect={() => {}}
      />
    );
    const html = document.body.innerHTML.toLowerCase();
    expect(html).to.contain("menu");
  });

  it("BaseModal acepta children", () => {
    render(
      <BaseModal open={true} title="Demo">
        <div data-testid="child" />
      </BaseModal>
    );
    expect(screen.getByText("Demo")).to.exist;
    expect(screen.getByTestId("child")).to.exist;
  });

  it("LoginCard renderiza formulario", () => {
    renderWithProviders(<LoginCard onFinish={() => { } } isPending={false} />);
    const html = document.body.innerHTML.toLowerCase();
    expect(html).to.contain("usuario");
  });

  it("UserTable exporta componente", () => {
    expect(UserTable).to.be.a("function");
  });

  it("FlatTables exporta componente", () => {
    expect(FlatTables).to.be.a("function");
  });

  it("DeviceTables exporta componente", () => {
    expect(DeviceTables).to.be.a("function");
  });

  it("CategoryTables exporta componente", () => {
    expect(CategoryTables).to.be.a("function");
  });
});