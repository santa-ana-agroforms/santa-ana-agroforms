export const opciones = [
  "Comentarios",
  "Correo electrónico",
  "Decimal",
  "Dirección",
  "Nombre",
  "Número",
  "Password",
];
export const grupos = ["Grupo A", "Grupo B", "Otro"];

// utils/normalizeFieldName.ts

export const normalizeFieldName = (name: string): string => {
  if (!name) return "";
  return name
    .trim() // elimina espacios iniciales y finales
    .replace(/\s+/g, "_") // reemplaza espacios por "_"
    .replace(/[^\w_]/g, "") // elimina caracteres no válidos (acentos, signos, etc.)
    .toLowerCase(); // opcional: todo en minúsculas
};
