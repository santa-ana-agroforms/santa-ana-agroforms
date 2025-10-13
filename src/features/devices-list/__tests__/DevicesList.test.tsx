import { render, screen } from "@testing-library/react";

import DevicesList from "@/features/devices-list";

describe("DevicesList", () => {
  test("muestra input de búsqueda", () => {
    render(<DevicesList />);
    expect(
      screen.getByPlaceholderText(/Introduzca el texto a buscar/i)).toBeInTheDocument();
    expect(
      screen.getByRole("table")
    ).toBeInTheDocument();
  });
});
