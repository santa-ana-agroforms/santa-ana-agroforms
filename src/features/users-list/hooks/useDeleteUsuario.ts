// src/hooks/useDeleteUsuario.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUsuario } from "../services/usuarios-services";

export function useDeleteUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nombreUsuario: string) => deleteUsuario(nombreUsuario),
    onSuccess: (_, nombreUsuario) => {
      // 🔄 Invalida la lista completa
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });

      // ❌ Remueve el usuario del cache individual si existiera
      queryClient.removeQueries({ queryKey: ["usuario", nombreUsuario] });
    },
  });
}
