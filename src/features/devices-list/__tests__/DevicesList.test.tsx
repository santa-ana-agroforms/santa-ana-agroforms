import { render, screen } from "@testing-library/react";

import DevicesList from "@/features/devices-list";

describe("DevicesList", () => {
  test("muestra botón de Categoría e input de búsqueda", () => {
    render(<DevicesList />);
    expect(
      screen.getByRole("button", { name: /Categoría/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Introduzca el texto a buscar/i)
    ).toBeInTheDocument();
  });
});
