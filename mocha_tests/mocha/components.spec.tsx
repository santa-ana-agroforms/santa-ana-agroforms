import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import { AppHeader } from '../../src/components/AppHeader';
import { AppSidebar } from '../../src/components/AppSideBar';
import BaseModal from '../../src/components/BaseModal';
import { LoginCard } from '../../src/components/LoginCard';
import UserTable from '../../src/components/UserTable';
import FlatTables from '../../src/components/FlatTables';
import DeviceTables from '../../src/components/DeviceTables';
import CategoryTables from '../../src/components/CategoryTables';

describe('Components render', () => {
  it('AppHeader renderiza sin crashear', () => {
    render(<AppHeader collapsed={false} onToggle={() => {}} title="Demo" />);
    expect(screen.getByRole('banner')).to.exist;
  });

  it('AppSideBar renderiza menú', () => {
    render(<AppSidebar navigate={() => {}} collapsed={false} selectedKey="1" onSelect={() => {}} />);
    expect(document.body.innerHTML.toLowerCase()).to.contain('menu');
  });

  it('BaseModal acepta children', () => {
    render(<BaseModal open={true} title="Demo"><div data-testid="child" /></BaseModal>);
    expect(screen.getByText('Demo')).to.exist;
    expect(screen.getByTestId('child')).to.exist;
  });

  it('LoginCard renderiza formulario', () => {
    render(<LoginCard onFinish={() => {}} />);
    expect(document.body.innerHTML.toLowerCase()).to.contain('usuario');
  });

  it('UserTable exporta componente', () => {
    expect(UserTable).to.be.a('function');
  });

  it('FlatTables exporta componente', () => {
    expect(FlatTables).to.be.a('function');
  });

  it('DeviceTables exporta componente', () => {
    expect(DeviceTables).to.be.a('function');
  });

  it('CategoryTables exporta componente', () => {
    expect(CategoryTables).to.be.a('function');
  });
});