import { AuthorizationEntry } from "./types";

export const filterEntries = (entries: AuthorizationEntry[], query: string) => {
  if (!query) return entries;
  const lower = query.toLowerCase();
  return entries.filter((e) =>
    [
      e.form,
      e.user,
      e.userFrom,
      e.title,
      e.notes || "",
      e.startedAt,
      e.finishedAt,
      e.receivedAt,
    ].some((field) => field.toLowerCase().includes(lower))
  );
};
