import { render, screen } from "@testing-library/react";

import DataSourceModal from "@/features/data-sources/components/DataSourceModal";

describe("DataSourceModal", () => {
  test("Renderiza al estar visible", () => {
    render(<DataSourceModal visible onCancel={() => {}} onCreate={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
