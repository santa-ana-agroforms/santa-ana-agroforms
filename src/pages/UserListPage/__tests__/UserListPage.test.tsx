import { render, screen } from "@testing-library/react";

import UserListPage from "@/pages/UserListPage";

describe("UserListPage", () => {
  test("renderiza tabla de usuarios", () => {
    render(<UserListPage />);
    expect(screen.getByRole("table", { hidden: true })).toBeInTheDocument();
  });
});
