import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppHeader } from "@/components/AppHeader";

describe("AppHeader", () => {
  test("Muestra el título recibido y el icono", () => {
    const onToggle = jest.fn();

    const { rerender } = render(
      <AppHeader collapsed={false} onToggle={onToggle} title="Mi Título" />
    );
    expect(screen.getByText("Mi Título")).toBeInTheDocument();
    // MenuFoldOutlined por defecto cuando collapsed=false
    expect(screen.getByRole("img", { name: /menu-fold/i })).toBeInTheDocument();

    rerender(<AppHeader collapsed={true} onToggle={onToggle} title="Otro" />);
    expect(screen.getByText("Otro")).toBeInTheDocument();
    // MenuUnfoldOutlined cuando collapsed=true
    expect(
      screen.getByRole("img", { name: /menu-unfold/i })
    ).toBeInTheDocument();
  });

  test("Llamada a onToggle", async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<AppHeader collapsed={false} onToggle={onToggle} title="" />);
    await user.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
