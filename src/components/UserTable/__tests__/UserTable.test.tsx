import { render, screen } from "@testing-library/react";

import { EditUserValues } from "@/components/DeviceTables/components/EditUserModal";
import UserTable, { UserType } from "@/components/UserTable";

describe("UserTable", () => {
  test("Renderizar una tabla", () => {
    render(
      <UserTable
        data={[]}
        onEdit={function (record: UserType): void {
          throw new Error("Function not implemented.");
        }}
        onDelete={function (record: UserType): void {
          throw new Error("Function not implemented.");
        }}
        onCreate={function (values: EditUserValues): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    expect(screen.getByRole("table", { hidden: true })).toBeInTheDocument();
  });
});
