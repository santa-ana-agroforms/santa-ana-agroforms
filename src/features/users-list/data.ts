// src/components/FormsLists/data.ts

import type { UserType } from "@/components/UserTable";

export const users: UserType[] = [
  {
    key: '1',
    id: 'admin',
    nombre: 'Administrador',
    contraseña: '*****',
    activo: true,
    perfil: 'Administrador',
    email: 'ecuellar@interlinksoft.net',
  },
  {
    key: '2',
    id: 'ecuellar',
    nombre: 'Erick Cuellar',
    contraseña: '*******',
    activo: true,
    perfil: 'Administrador',
    email: 'ecuellar@interlinksoft.net',
  },
  {
    key: '3',
    id: 'test',
    nombre: 'Usuario pruebas',
    contraseña: '*******',
    activo: true,
    perfil: 'Usuario',
    email: 'ecuellar@interlinksoft.net',
  },
  {
    key: '4',
    id: 'user2',
    nombre: 'usuario 2',
    contraseña: '****',
    activo: true,
    perfil: 'Usuario',
    email: '',
  },
];
