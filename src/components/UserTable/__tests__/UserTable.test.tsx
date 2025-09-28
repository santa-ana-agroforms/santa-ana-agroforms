import { render, screen } from '@testing-library/react';
import UserTable, { UserType } from '@/components/UserTable';
import { EditUserValues } from '@/components/DeviceTables/components/EditUserModal';

describe('UserTable', () => {
  test('Renderizar una tabla', () => {
    render(<UserTable data={[]} onEdit={function (record: UserType): void {
        throw new Error('Function not implemented.');
    } } onDelete={function (record: UserType): void {
        throw new Error('Function not implemented.');
    } } onCreate={function (values: EditUserValues): void {
        throw new Error('Function not implemented.');
    } } />);
    expect(screen.getByRole('table', { hidden: true })).toBeInTheDocument();
  });
});
