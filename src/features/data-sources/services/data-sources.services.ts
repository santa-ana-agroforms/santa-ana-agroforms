import { api } from "@/features/user-autentication/services/auth.service";

export interface FuenteDatoAPI {
  id: string;
  nombre: string;
  descripcion: string;
  archivo_nombre: string;
  archivo_url: string;
  tipo_archivo: string;
  columnas: string[];
  preview_data?: any[];
}

export interface CrearFuenteDatoParams {
  nombre: string;
  descripcion?: string;
  archivo: File;
}

export async function getFuentesDatos(opts?: {
  signal?: AbortSignal;
}): Promise<FuenteDatoAPI[]> {
  const res = await api.get<FuenteDatoAPI[]>(`/api/fuentes-datos/`, {
    signal: opts?.signal,
  });

  return res.data;
}

/**
 * Sube una nueva fuente de datos al backend y la almacena en Azure.
 * Requiere multipart/form-data
 */
export async function crearFuenteDato({
  nombre,
  descripcion,
  archivo,
}: {
  nombre: string;
  descripcion?: string;
  archivo: File;
}) {
  const formData = new FormData();
  formData.append("nombre", nombre);
  if (descripcion) formData.append("descripcion", descripcion);
  formData.append("archivo", archivo);

  const res = await api.post("/api/fuentes-datos/", formData);
  return res.data;
}

/**
 * Elimina una fuente de datos del backend.
 * @param id UUID de la fuente de datos
 */
export async function deleteFuenteDato(id: string): Promise<void> {
  await api.delete(`/api/fuentes-datos/${id}/`);
}
