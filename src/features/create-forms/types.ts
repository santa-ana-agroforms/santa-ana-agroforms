export type FieldJson = {
  id_campo?: string;
  clase: string; // ej: "number"
  nombre_campo: string; // del form: nombre
  etiqueta: string; // del form: etiqueta
  ayuda: string; // del form: ayuda
  requerido: boolean; // del form: requerido
  config?:
    | { id_group?: string; name?: string }
    | { vars: string[]; operation: string }
    | Record<string, any>; // del form: tamano
  tipo?: string; // ej: "group", "input", etc.
  grupoTemporal?: string; // referencia temporal al grupo (nombre_campo)
  grupo?: string; // id real del grupo una vez creado
};
