import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LoginPage } from "@/pages/LoginPage";

// Mock estable de useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("Con credenciales válidas navega a /home", async () => {
    const realSetTimeout = global.setTimeout;
    const setTimeoutSpy = jest.spyOn(global, "setTimeout").mockImplementation(((
      cb: any,
      ms?: number,
      ...args: any[]
    ) => {
      if (typeof ms === "number" && ms >= 1200) {
        if (typeof cb === "function") cb(...args);
        else {
          /* cbs string no aplica */
        }
        return 0 as any;
      }
      return (realSetTimeout as any)(cb, ms, ...args);
    }) as any);

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText(/Usuario/i), "mario");
    await user.type(screen.getByPlaceholderText(/Contraseña/i), "secreta");
    await user.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });

    setTimeoutSpy.mockRestore();
  });
});
