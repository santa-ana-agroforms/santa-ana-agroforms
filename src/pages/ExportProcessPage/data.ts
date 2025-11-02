export function filterEntries(entries: any[], search: string) {
  if (!search) return entries;

  const lowerSearch = search.toLowerCase();

  return entries.filter((e) => {
    // Aseguramos que todos sean strings válidos antes de comparar
    const values = [
      e.key?.toString() ?? "",
      e.formulario?.toString() ?? "",
      e.respuestas?.toString() ?? "",
    ];

    return values.some((v) => v.toLowerCase().includes(lowerSearch));
  });
}
