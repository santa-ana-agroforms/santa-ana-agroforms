export type FieldJson = {
  clase: string; // ej: "number"
  nombre_campo: string; // del form: nombre
  etiqueta: string; // del form: etiqueta
  ayuda: string; // del form: ayuda
  requerido: boolean; // del form: requerido
  config: { max?: number }; // del form: tamano
};
