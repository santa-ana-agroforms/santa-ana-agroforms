// src/pages/UserListPage.tsx
import React, { useState } from "react";

import UserList from "@/features/users-list";

interface User {
  id: string;
  name: string;
  email: string;
  // añade aquí más campos si los tienes
}

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full gap-4">
      <UserList />
    </div>
  );
};

export default UserListPage;
