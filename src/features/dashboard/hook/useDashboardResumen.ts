// src/features/dashboard/hooks/useDashboardResumen.ts
import { useQuery } from "@tanstack/react-query";

import {
  getDashboardResumen,
  type DashboardResumen,
} from "../services/dashboard.service";

/**
 * Hook que obtiene el resumen general del dashboard
 */
export function useDashboardResumen() {
  return useQuery<DashboardResumen, Error>({
    queryKey: ["dashboard", "resumen"],
    queryFn: ({ signal }) => getDashboardResumen({ signal }),
  });
}
