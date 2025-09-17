import { render, screen } from '@testing-library/react';
import EditUserModal, { EditUserValues } from '@/components/DeviceTables/components/EditUserModal';

describe('EditUserModal', () => {
  test('Muestra initialValues cuando visible=true', () => {
    const initial: EditUserValues = {
      id: 'USR-123',
      nombre: 'Mario',
      email: 'mariog@yahoo.com',
      activo: true,
      rol: 'admin',
    } as any;

    render(
      <EditUserModal
        visible
        initialValues={initial}
        onCancel={() => {}}
        onSave={() => {}}
      />
    );

    // Verificamos que los campos se rellenan (por su valor)
    expect(screen.getByDisplayValue('USR-123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mario')).toBeInTheDocument();
    expect(screen.getByDisplayValue('mariog@yahoo.com')).toBeInTheDocument();
  });
});
