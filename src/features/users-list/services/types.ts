export interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Usuario {
  nombre_usuario: string;
  nombre: string;
  email: string;
  activo: boolean;
  acceso_web?: boolean;
  //roles: Rol[];
}

export interface QrStartResponse {
  sid: string;
  qr: string;
  expiresIn: number;
}

export interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface CreateUsuarioPayload {
  nombre_usuario: string;
  nombre: string;
  password: string;
  activo: boolean;
  correo?: string;
  acceso_web?: boolean;
}

export interface UsuarioResponse {
  nombre: string;
  nombre_usuario: string;
  correo: string;
  activo: boolean;
  roles: {
    id: string;
    nombre: string;
    descripcion: string;
  }[];
}

export interface UpdateUsuarioPayload {
  nombre?: string;
  correo?: string;
  activo?: boolean;
  // Opcional: si PATCH en /usuarios/ también acepta actualizar roles
  roles?: string[]; // IDs de roles
  acceso_web?: boolean;
  password?: string;
}
