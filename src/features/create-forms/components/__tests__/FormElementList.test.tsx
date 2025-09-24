import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import FormElementList from '@/features/create-forms/components/FormElementList';

describe('FormElementList', () => {
  test('Se renderiza lista de elementos (Texto, Dato, Niveles)', async () => {
    await act(async () => {
      render(<FormElementList onMenuClick={undefined} />);
    });

    expect(await screen.findByText('Texto')).toBeInTheDocument();
    expect(screen.getByText('Dato')).toBeInTheDocument();
    expect(screen.getByText(/Niveles/i)).toBeInTheDocument();
  });
});
