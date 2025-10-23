// types.ts (o donde prefieras)
export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface FormularioAPI {
  id: string;
  categoria_nombre: string | null;
  nombre: string;
  descripcion: string;
  permitir_fotos: boolean;
  permitir_gps: boolean;
  disponible_desde_fecha: string; // ISO
  disponible_hasta_fecha: string; // ISO
  estado: string;
  forma_envio: string;
  es_publico: boolean;
  auto_envio: boolean;
  categoria: string | null; // UUID o null
}

// ¡OJO!: cambia a string para alinear con el backend
export interface ItemType {
  key: string;
  id: string; // <— antes number
  titulo: string;
  desde: string;
  hasta: string;
  estado: string;
  esPublico: boolean;
  autoEnvio: boolean;
}

export interface CategoryType {
  key: string;
  name: string;
  items: ItemType[];
}

export interface CreateAsignacionDto {
  /** username */
  usuario: string;
  /** lista de ids de formularios (uuid o id que tu backend espera) */
  formularios: string[];
}

export interface UpdateFormularioDto extends Partial<FormularioAPI> {}
