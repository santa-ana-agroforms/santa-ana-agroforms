// src/features/dashboard/services/dashboard.service.ts
import { api } from "@/features/user-autentication/services/auth.service";

export interface DashboardResumen {
  usuarios: {
    total: number;
    activos: number;
    inactivos: number;
    prc_activos: number;
    acceso_web: number;
  };
  formularios: {
    total: number;
    por_estado: Array<{
      estado: string;
      total: number;
    }>;
    por_categoria: Array<{
      categoria_nombre: string;
      total: number;
    }>;
  };
  asignaciones: {
    total: number;
    usuarios_con_formularios: number;
  };
  datasets: {
    total: number;
    activos: number;
  };
  entradas: {
    group: string;
    recibidos_por_fecha: Array<{
      periodo: string;
      total: number;
    }>;
  };
}

/**
 * Obtiene el resumen general del dashboard
 */
export async function getDashboardResumen(opts?: {
  signal?: AbortSignal;
}): Promise<DashboardResumen> {
  const res = await api.get<DashboardResumen>("/api/dashboard/resumen", {
    signal: opts?.signal,
  });

  return res.data;
}
