// src/create-forms/hooks/useFormsListsData.ts
import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import { getCategorias } from "../services/categories.service";
import { getFormularios } from "../services/forms-services";

// Ajusta estos tipos a los que retornan tus services reales:
export interface ItemType {
  key: string;
  id: number | string;
  titulo: string;
  desde: string;
  hasta: string;
  estado: string;
  esPublico: boolean;
  autoEnvio: boolean;
  forma_envio?: string;
  descripcion?: string;
}
export interface CategoryType {
  key: string;
  name: string;
  items: ItemType[];
}

export function useFormsListsData() {
  const categoriasQ = useQuery({
    queryKey: ["categorias"],
    queryFn: ({ signal }) => getCategorias(),
    staleTime: 5 * 60 * 1000, // 5 min "fresh" (ajusta o usa Infinity)
    gcTime: 30 * 60 * 1000, // v5: usa gcTime en lugar de cacheTime
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const formulariosQ = useQuery({
    queryKey: ["formularios"],
    queryFn: ({ signal }) => getFormularios(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Loading / error agregados
  const isLoading = categoriasQ.isLoading || formulariosQ.isLoading;
  const error = categoriasQ.error ?? formulariosQ.error;

  const categoriesData: CategoryType[] = useMemo(() => {
    if (!categoriasQ.data || !formulariosQ.data) return [];

    // Diccionario base de categorías
    const byCatId = new Map<string, CategoryType>();
    categoriasQ.data.forEach((c: any) => {
      byCatId.set(c.id, { key: c.id, name: c.nombre, items: [] });
    });

    // Asignar formularios a su categoría (ignorar los que no tengan)
    formulariosQ.data.forEach((f: any) => {
      if (!f.categoria) return;
      const cat = byCatId.get(f.categoria);
      if (!cat) return;

      const item: ItemType = {
        key: f.id,
        id: f.id,
        titulo: f.nombre,
        desde: moment(f.disponible_desde_fecha).format("DD/MM/YYYY"),
        hasta: moment(f.disponible_hasta_fecha).format("DD/MM/YYYY"),
        estado: f.estado,
        esPublico: f.es_publico,
        autoEnvio: f.auto_envio,
        forma_envio: f.forma_envio,
        descripcion: f.descripcion,
      };
      cat.items.push(item);
    });

    return Array.from(byCatId.values());
  }, [categoriasQ.data, formulariosQ.data]);

  return { categoriesData, isLoading, error };
}
