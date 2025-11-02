import { api } from "@/features/user-autentication/services/auth.service";

/**
 * Exporta un formulario individual en el formato especificado.
 * @param formId ID del formulario
 * @param fmt Formato de exportación: 'csv' | 'json' | 'xlsx'
 */
export async function exportEntry(
  formId: string,
  fmt: "csv" | "json" | "xlsx" = "xlsx"
): Promise<void> {
  const res = await api.get(`/api/entries/${formId}/export/`, {
    params: { fmt },
    responseType: "blob", // 📦 muy importante: queremos descargar un archivo
  });

  // Crea un blob y fuerza la descarga
  const blob = new Blob([res.data]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  // Nombre sugerido del archivo
  const extension =
    fmt === "xlsx" ? "xlsx"
    : fmt === "csv" ? "csv"
    : "json";
  a.download = `formulario_${formId}.${extension}`;

  a.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Exporta todos los formularios como un ZIP en el formato especificado.
 * @param format Formato de exportación dentro del ZIP: 'csv' | 'json' | 'xlsx'
 */
export async function exportAllEntries(
  format: "csv" | "json" | "xlsx" = "xlsx"
): Promise<void> {
  const res = await api.get(`/api/entries/export-all/`, {
    params: { format },
    responseType: "blob", // 📦 archivo ZIP
  });

  const blob = new Blob([res.data]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `formularios_exportados.zip`;
  a.click();
  window.URL.revokeObjectURL(url);
}
