import { api } from "@/features/user-autentication/services/auth.service";
import {
  postCampoActualSingle,
  postCamposActualBatch,
  type CampoAPI,
} from "../campos.services";

describe("campos.services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("postCampoActualSingle", () => {
    test("envía un campo exitosamente", async () => {
      const campo: CampoAPI = {
        tipo: "text",
        clase: "input",
        nombre_campo: "nombre",
        etiqueta: "Nombre completo",
      } as any;

      const mockResponse = { id: "campo-123", ...campo };

      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await postCampoActualSingle("page-123", campo);

      expect(api.post).toHaveBeenCalledWith(
        "/api/paginas/page-123/campos/",
        expect.objectContaining({
          tipo: "text",
          clase: "input",
          nombre_campo: "nombre",
          etiqueta: "Nombre completo",
        }),
        expect.objectContaining({})
      );
      expect(result).toEqual(mockResponse);
    });

    test("sanitiza valores undefined a null", async () => {
      const campo: CampoAPI = {
        tipo: "text",
        clase: "input",
        nombre_campo: "test",
        etiqueta: "Test",
        opcional: undefined,
      } as any;

      (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

      await postCampoActualSingle("page-123", campo);

      const sentData = (api.post as jest.Mock).mock.calls[0][1];
      expect(sentData.opcional).toBe(null);
    });

    test("lanza error cuando pageId está vacío", async () => {
      const campo: CampoAPI = {
        tipo: "text",
        clase: "input",
      } as any;

      await expect(postCampoActualSingle("", campo)).rejects.toThrow(
        "pageId es requerido"
      );
    });

    test("respeta la señal de abort", async () => {
      const controller = new AbortController();
      const campo: CampoAPI = { tipo: "text" } as any;

      (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

      await postCampoActualSingle("page-123", campo, {
        signal: controller.signal,
      });

      expect(api.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ signal: controller.signal })
      );
    });

    test("maneja error con status y detail del backend", async () => {
      const campo: CampoAPI = { tipo: "text" } as any;

      (api.post as jest.Mock).mockRejectedValueOnce({
        response: {
          status: 400,
          data: { error: "Campo inválido", detalle: "Falta nombre_campo" },
        },
      });

      await expect(
        postCampoActualSingle("page-123", campo)
      ).rejects.toThrow(/400/);
    });

    test("maneja error con mensaje de texto plano", async () => {
      const campo: CampoAPI = { tipo: "text" } as any;

      (api.post as jest.Mock).mockRejectedValueOnce({
        response: {
          status: 500,
          data: "Internal server error",
        },
        message: "Request failed",
      });

      await expect(
        postCampoActualSingle("page-123", campo)
      ).rejects.toThrow();
    });

    test("retorna null cuando no hay body en la respuesta", async () => {
      const campo: CampoAPI = { tipo: "text" } as any;

      (api.post as jest.Mock).mockResolvedValueOnce({});

      const result = await postCampoActualSingle("page-123", campo);

      expect(result).toBeNull();
    });
  });

  describe("postCamposActualBatch", () => {
    test("envía múltiples campos exitosamente", async () => {
      const campos: CampoAPI[] = [
        { tipo: "text", clase: "input", nombre_campo: "nombre" } as any,
        { tipo: "email", clase: "input", nombre_campo: "correo" } as any,
        { tipo: "number", clase: "input", nombre_campo: "edad" } as any,
      ];

      (api.post as jest.Mock)
        .mockResolvedValueOnce({ data: { id: "1" } })
        .mockResolvedValueOnce({ data: { id: "2" } })
        .mockResolvedValueOnce({ data: { id: "3" } });

      const result = await postCamposActualBatch("page-123", campos);

      expect(api.post).toHaveBeenCalledTimes(3);
      expect(result.ok).toHaveLength(3);
      expect(result.errors).toHaveLength(0);
    });

    test("maneja errores parciales en batch", async () => {
      const campos: CampoAPI[] = [
        { tipo: "text", nombre_campo: "campo1" } as any,
        { tipo: "text", nombre_campo: "campo2" } as any,
        { tipo: "text", nombre_campo: "campo3" } as any,
      ];

      (api.post as jest.Mock)
        .mockResolvedValueOnce({ data: { id: "1" } })
        .mockRejectedValueOnce(new Error("Error en campo 2"))
        .mockResolvedValueOnce({ data: { id: "3" } });

      const result = await postCamposActualBatch("page-123", campos);

      expect(result.ok).toHaveLength(2);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].index).toBe(1);
      expect(result.errors[0].message).toContain("Error en campo 2");
    });

    test("retorna todos los errores cuando todos fallan", async () => {
      const campos: CampoAPI[] = [
        { tipo: "text" } as any,
        { tipo: "text" } as any,
      ];

      (api.post as jest.Mock)
        .mockRejectedValueOnce(new Error("Error 1"))
        .mockRejectedValueOnce(new Error("Error 2"));

      const result = await postCamposActualBatch("page-123", campos);

      expect(result.ok).toHaveLength(0);
      expect(result.errors).toHaveLength(2);
    });

    test("maneja array vacío sin errores", async () => {
      const result = await postCamposActualBatch("page-123", []);

      expect(api.post).not.toHaveBeenCalled();
      expect(result.ok).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    test("respeta la señal de abort en batch", async () => {
      const controller = new AbortController();
      const campos: CampoAPI[] = [{ tipo: "text" } as any];

      (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

      await postCamposActualBatch("page-123", campos, {
        signal: controller.signal,
      });

      expect(api.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ signal: controller.signal })
      );
    });

    test("continúa procesando después de un error", async () => {
      const campos: CampoAPI[] = [
        { tipo: "text", nombre_campo: "campo1" } as any,
        { tipo: "text", nombre_campo: "campo2" } as any,
        { tipo: "text", nombre_campo: "campo3" } as any,
        { tipo: "text", nombre_campo: "campo4" } as any,
      ];

      (api.post as jest.Mock)
        .mockResolvedValueOnce({ data: { id: "1" } })
        .mockRejectedValueOnce(new Error("Fallo"))
        .mockRejectedValueOnce(new Error("Fallo 2"))
        .mockResolvedValueOnce({ data: { id: "4" } });

      const result = await postCamposActualBatch("page-123", campos);

      expect(api.post).toHaveBeenCalledTimes(4);
      expect(result.ok).toHaveLength(2);
      expect(result.errors).toHaveLength(2);
    });
  });
});