// src/features/ExportProcessPage/types.ts
export interface ExportProcessPage {
  key: string;
  formulario: string;
  intervalo: string;
  servidor: string;
  baseDatos: string;
  ultimoId: number;
  ultima_actualizacion?: string;
  ultimo_mensaje?: string;
}
