// src/features/form-assignment/types.ts
export interface AuthorizationEntry {
  key: string;
  user: string;
  form: string;
  status: "pending" | "approved" | "rejected";
  startedAt: string; // ejemplo formato: "15/02 10:53"
  finishedAt: string;
  receivedAt: string;
  userFrom: string;
  title: string;
  notes?: string;
}
