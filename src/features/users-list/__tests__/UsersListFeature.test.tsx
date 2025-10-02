import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UsersListFeature from "@/features/users-list";

describe("UsersListFeature", () => {
  test("muestra tabla de usuarios", () => {
    render(<UsersListFeature />);
    expect(screen.getByRole("table", { hidden: true })).toBeInTheDocument();
  });
});

describe("UsersListFeature (buscador)", () => {
  test("permite escribir en el filtro", async () => {
    const user = userEvent.setup();
    render(<UsersListFeature />);
    const search = screen.getByPlaceholderText(/Buscar|Search|Filtrar/i);
    await user.type(search, "mario");
    expect(search).toHaveValue("mario");
  });
});
