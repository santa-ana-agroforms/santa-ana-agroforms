import { ExportProcessPage } from "./types";

export const filterEntries = (entries: ExportProcessPage[], query: string) => {
  if (!query) return entries;
  const lower = query.toLowerCase();

  return entries.filter((e) =>
    [
      e.key,
      e.formulario,
      e.intervalo,
      e.servidor,
      e.baseDatos,
      e.ultimoId.toString(),
      e.ultima_actualizacion || "",
      e.ultimo_mensaje || "",
    ].some((field) => field.toLowerCase().includes(lower))
  );
};
