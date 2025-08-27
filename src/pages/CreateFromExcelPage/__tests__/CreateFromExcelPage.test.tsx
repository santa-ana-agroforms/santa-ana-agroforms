import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateFromExcelPage from '@/pages/CreateFromExcelPage';

describe('CreateFromExcelPage', () => {
  test('El botón "cargar" está deshabilitado inicialmente', () => {
    render(<CreateFromExcelPage />);
    const btn = screen.getByRole('button', { name: /CARGAR/i });
    expect(btn).toBeDisabled();
  });
});
