import { getColumns, categories, type ItemType } from "../data";

describe("CategoryTables data", () => {
  const mockCallbacks = {
    onAdd: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onDatos: jest.fn(),
  };

  const sortedInfo: any = {};
  const filteredInfo: any = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("categories", () => {
    test("[C0020] contiene categorías Local y Externa", () => {
      expect(categories).toHaveLength(2);
      expect(categories[0].name).toBe("Local");
      expect(categories[1].name).toBe("Externa");
    });

    test("[C0021] categoría Local tiene items", () => {
      const localCategory = categories.find((c) => c.key === "local");
      expect(localCategory).toBeDefined();
      expect(localCategory!.items.length).toBeGreaterThan(0);
    });

    test("[C0022] categoría Externa tiene items", () => {
      const externaCategory = categories.find((c) => c.key === "externa");
      expect(externaCategory).toBeDefined();
      expect(externaCategory!.items.length).toBeGreaterThan(0);
    });

    test("[C0023] items tienen la estructura correcta", () => {
      const item = categories[0].items[0];
      expect(item).toHaveProperty("key");
      expect(item).toHaveProperty("codigo");
      expect(item).toHaveProperty("descripcion");
      expect(item).toHaveProperty("tipoFuente");
      expect(item).toHaveProperty("ultActualizacion");
    });
  });

  describe("getColumns", () => {
    test("[C0024] retorna array de columnas", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete,
        mockCallbacks.onDatos
      );

      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    test("[C0025] primera columna tiene botón de acciones", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const actionsColumn = columns[0];
      expect(actionsColumn.key).toBe("actions");
      expect(actionsColumn.dataIndex).toBe("actions");
    });

    test("[C0026] columna Código tiene filtros", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      expect(codigoColumn).toBeDefined();
      expect(codigoColumn!.filters).toBeDefined();
      expect(Array.isArray(codigoColumn!.filters)).toBe(true);
    });

    test("[C0027] columna Descripción tiene sorter", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const descripcionColumn = columns.find((c) => c.key === "descripcion");
      expect(descripcionColumn).toBeDefined();
      expect(descripcionColumn!.sorter).toBeDefined();
    });

    test("[C0028] columna Tipo fuente tiene filtros y sorter", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const tipoFuenteColumn = columns.find((c) => c.key === "tipoFuente");
      expect(tipoFuenteColumn).toBeDefined();
      expect(tipoFuenteColumn!.filters).toBeDefined();
      expect(tipoFuenteColumn!.sorter).toBeDefined();
    });

    test("[C0029] columna Intervalo tiene sorter personalizado", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const intervaloColumn = columns.find((c) => c.key === "intervalo");
      expect(intervaloColumn).toBeDefined();
      expect(typeof intervaloColumn!.sorter).toBe("function");

      // Probar el sorter
      const sorterFn = intervaloColumn!.sorter as (
        a: ItemType,
        b: ItemType
      ) => number;
      const item1 = { intervalo: "10,50" } as ItemType;
      const item2 = { intervalo: "5,25" } as ItemType;

      const result = sorterFn(item1, item2);
      expect(result).toBeGreaterThan(0);
    });

    test("[C0030] columna Ult. Actualización tiene sorter por fecha", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const ultActualizacionColumn = columns.find(
        (c) => c.key === "ultActualizacion"
      );
      expect(ultActualizacionColumn).toBeDefined();
      expect(typeof ultActualizacionColumn!.sorter).toBe("function");

      // Probar el sorter de fechas
      const sorterFn = ultActualizacionColumn!.sorter as (
        a: ItemType,
        b: ItemType
      ) => number;
      const item1 = { ultActualizacion: "25/12/2020" } as ItemType;
      const item2 = { ultActualizacion: "04/04/2020" } as ItemType;

      const result = sorterFn(item1, item2);
      expect(result).toBeGreaterThan(0);
    });

    test("[C0031] columna Datos tiene render personalizado", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete,
        mockCallbacks.onDatos
      );

      const datosColumn = columns.find((c) => c.key === "datos");
      expect(datosColumn).toBeDefined();
      expect(datosColumn!.render).toBeDefined();
    });

    test("[C0032] render de columna actions incluye iconos de editar y eliminar", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const actionsColumn = columns[0];
      expect(actionsColumn.render).toBeDefined();
    });

    test("[C0033] todas las columnas tienen keys únicos", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const keys = columns.map((c) => c.key);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });

    test("[C0034] columnas tienen los títulos correctos", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const expectedTitles = [
        "Código",
        "Descripción",
        "Tipo fuente",
        "Conexión",
        "Comando",
        "Intervalo (s)",
        "Ult. Actualiz.",
        "Ult. Mensaje",
        "Datos",
      ];

      const columnTitles = columns
        .slice(1)
        .map((c) => c.title)
        .filter((t) => typeof t === "string");

      expectedTitles.forEach((title) => {
        expect(columnTitles).toContain(title);
      });
    });

    test("[C0035] columna Ult. Mensaje tiene filtros", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const ultMensajeColumn = columns.find((c) => c.key === "ultMensaje");
      expect(ultMensajeColumn).toBeDefined();
      expect(ultMensajeColumn!.filters).toBeDefined();
      expect(ultMensajeColumn!.onFilter).toBeDefined();
    });

    test("[C0036] filtros incluyen solo valores únicos", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      const filters = codigoColumn!.filters as any[];

      const values = filters.map((f) => f.value);
      const uniqueValues = new Set(values);

      expect(uniqueValues.size).toBe(values.length);
    });

    test("[C0037] columnas con ellipsis están configuradas correctamente", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      const descripcionColumn = columns.find((c) => c.key === "descripcion");
      const conexionColumn = columns.find((c) => c.key === "conexion");
      const comandoColumn = columns.find((c) => c.key === "comando");
      const datosColumn = columns.find((c) => c.key === "datos");

      expect(codigoColumn!.ellipsis).toBe(true);
      expect(descripcionColumn!.ellipsis).toBe(true);
      expect(conexionColumn!.ellipsis).toBe(true);
      expect(comandoColumn!.ellipsis).toBe(true);
      expect(datosColumn!.ellipsis).toBe(true);
    });

    test("[C0038] columnas tienen anchos específicos donde se requiere", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const actionsColumn = columns[0];
      const codigoColumn = columns.find((c) => c.key === "codigo");
      const descripcionColumn = columns.find((c) => c.key === "descripcion");
      const conexionColumn = columns.find((c) => c.key === "conexion");

      expect(actionsColumn.width).toBe(110);
      expect(codigoColumn!.width).toBe(120);
      expect(descripcionColumn!.width).toBe(160);
      expect(conexionColumn!.width).toBe(100);
    });

    test("[C0039] respeta sortedInfo para columnas ordenables", () => {
      const customSortedInfo = { columnKey: "codigo", order: "ascend" };

      const columns = getColumns(
        customSortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      expect(codigoColumn!.sortOrder).toBe("ascend");
    });

    test("[C0040] respeta filteredInfo para columnas filtrables", () => {
      const customFilteredInfo = { codigo: ["Cabezal"] };

      const columns = getColumns(
        sortedInfo,
        customFilteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      expect(codigoColumn!.filteredValue).toEqual(["Cabezal"]);
    });

    test("[C0041] onFilter funciona correctamente en columna código", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      const onFilterFn = codigoColumn!.onFilter as (
        value: any,
        record: ItemType
      ) => boolean;

      const item = { codigo: "Cabezal" } as ItemType;
      expect(onFilterFn("Cabezal", item)).toBe(true);
      expect(onFilterFn("Otro", item)).toBe(false);
    });

    test("[C0042] sorter de descripción ordena alfabéticamente", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const descripcionColumn = columns.find((c) => c.key === "descripcion");
      const sorterFn = descripcionColumn!.sorter as (
        a: ItemType,
        b: ItemType
      ) => number;

      const item1 = { descripcion: "Beta" } as ItemType;
      const item2 = { descripcion: "Alfa" } as ItemType;

      expect(sorterFn(item1, item2)).toBeGreaterThan(0);
      expect(sorterFn(item2, item1)).toBeLessThan(0);
    });

    test("[C0043] maneja valores undefined en sorter de intervalo", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const intervaloColumn = columns.find((c) => c.key === "intervalo");
      const sorterFn = intervaloColumn!.sorter as (
        a: ItemType,
        b: ItemType
      ) => number;

      const item1 = { intervalo: undefined } as ItemType;
      const item2 = { intervalo: "10,00" } as ItemType;

      const result = sorterFn(item1, item2);
      expect(typeof result).toBe("number");
    });

    test("[C0044] filtro de ultMensaje funciona correctamente", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const ultMensajeColumn = columns.find((c) => c.key === "ultMensaje");
      const onFilterFn = ultMensajeColumn!.onFilter as (
        value: any,
        record: ItemType
      ) => boolean;

      const item = { ultMensaje: "OK" } as ItemType;
      expect(onFilterFn("OK", item)).toBe(true);
      expect(onFilterFn("ERROR", item)).toBe(false);
    });
  });
});