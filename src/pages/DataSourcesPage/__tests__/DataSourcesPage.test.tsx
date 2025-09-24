import { render, screen } from '@testing-library/react';
import DataSourcesPage from '..';

describe('DataSourcesPage', () => {
  test('muestra controles base (botón agregar/filtrar o tabla)', () => {
    render(<DataSourcesPage />);

    // Algún texto típico de columnas (opcional, para robustez)
    expect(screen.getByText(/Código/i)).toBeInTheDocument();

    const tables = screen.getAllByRole('table', { hidden: true });
    expect(tables.length).toBeGreaterThan(0);
  });
});
