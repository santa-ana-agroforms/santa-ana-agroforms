import { api } from "@/features/user-autentication/services/auth.service";

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export async function getCategorias(): Promise<Categoria[]> {
  const res = await api.get("/api/categorias/");
  return res.data;
}