import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';

jest.mock('../../CreateFormsPage', () => ({
  __esModule: true,
  default: () => <div data-testid="create-forms-stub" />,
}));
jest.mock('../../FormListPage', () => ({
  __esModule: true,
  default: () => <div data-testid="form-list-stub" />,
}));
jest.mock('../../DataSourcesPage', () => ({
  __esModule: true,
  default: () => <div data-testid="data-sources-stub" />,
}));
jest.mock('../../DevicesListPage', () => ({
  __esModule: true,
  default: () => <div data-testid="devices-list-stub" />,
}));

describe('HomePage', () => {
  test('renderiza sin errores', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    const h2 = await screen.findByRole('heading', {
      level: 2,
      name: /dashboard/i,
    });
    expect(h2).toBeInTheDocument();
  });
});
