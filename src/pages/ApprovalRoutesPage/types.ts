// src/pages/ApprovalRoutesPage/types.ts
export interface ApprovalTypes {
  key: string;
  routeId: number; // Id único de la ruta
  descripcion: string; // Descripción de la ruta
  dataSet: string; // Nombre del dataset
  campo1?: string; // Campo adicional opcional
  campo2?: string; // Segundo campo adicional opcional
  active: boolean; // Estado de la ruta (activa o no)
  addedDate: string; // Fecha en formato DD/MM/YYYY
  addedBy: string; // Usuario que agregó la ruta
  changedDate?: string; // Fecha de última modificación (opcional)
  changedBy?: string; // Usuario que realizó la última modificación (opcional)
}
