import { ApprovalTypes } from "./types";

export const filterEntries = (entries: ApprovalTypes[], query: string) => {
  if (!query) return entries;
  const lower = query.toLowerCase();
  return entries.filter((e) =>
    [
      e.routeId.toString(),
      e.descripcion,
      e.dataSet,
      e.campo1 || "",
      e.campo2 || "",
      e.addedDate,
      e.addedBy,
      e.changedDate || "",
      e.changedBy || "",
    ].some((field) => field.toLowerCase().includes(lower))
  );
};
