import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ApprovalRoutes from '../../src/pages/ApprovalRoutesPage';
import AssignmentsProgress from '../../src/pages/AssignmentsProgressPage';
import CreateForms from '../../src/pages/CreateFormsPage';
import CreateFromExcel from '../../src/pages/CreateFromExcelPage';
import Dashboard from '../../src/pages/DashboardPage';
import DevicesListPage from '../../src/pages/DevicesListPage';
import { LoginPage } from '../../src/pages/LoginPage';

describe('Pages export & render básico', () => {
  const pages = [
    ApprovalRoutes,
    AssignmentsProgress,
    CreateForms,
    CreateFromExcel,
    Dashboard,
    DevicesListPage,
    LoginPage
  ];

  pages.forEach((Page, idx) => {
    it(`Page[${idx}] exporta función`, () => {
      expect(Page).to.be.a('function');
    });
  });

  it('LoginPage render mínimo', () => {
    const { container } = render(<LoginPage />);
    expect(container).to.exist;
  });
});