import { render, screen } from "@testing-library/react";

import CreateFromExcelPage from "@/pages/CreateFromExcelPage";

describe("CreateFromExcelPage", () => {
  test('El botón "cargar" está deshabilitado inicialmente', () => {
    render(<CreateFromExcelPage />);
    const btn = screen.getByRole("button", { name: /CARGAR/i });
    expect(btn).toBeDisabled();
  });

  test("Muestra título de sección para subir Excel", () => {
    render(<CreateFromExcelPage />);
    expect(
      screen.getByText(/Seleccione el archivo Excel:/i)
    ).toBeInTheDocument();
  });
});
