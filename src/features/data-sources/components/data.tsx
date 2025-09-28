// src/components/CategoryTables/data.tsx
import { DeleteOutlined, FormOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";

export interface ItemType {
  key: string;
  codigo: string;
  descripcion: string;
  campo1?: string;
  conexion?: string;
  comando?: string;
  intervalo?: string;
  ultActualizacion?: string;
  ultMensaje?: string;
  datos?: string;
}

export interface DataManualType {
  key: string;
  codigo: string;
  descripcion: string;
  campo1?: string;
  campo2?: string;
  campo3?: string;
  campo4?: string;
  campo5?: string;
  campo6?: string;
  campo7?: string;
  campo8?: string;
  campo9?: string;
  campo10?: string;
}

export interface CategoryType {
  key: string;
  name: string;
  items: DataManualType[];
}

// --- Tus datos estáticos de categoría + filas ---
export const categories: CategoryType[] = [
  {
    key: "local",
    name: "Local",
    items: [],
  },
  {
    key: "externa",
    name: "Externa",
    items: [],
  },
];

// --- Función para generar las columnas, recibiendo estado de sort/filter y callbacks ---
export const getColumns = (
  sortedInfo: any,
  filteredInfo: any,
  onAdd: () => void,
  onEdit: (record: ItemType) => void,
  onDelete: (record: ItemType) => void,
  onDatos?: (record: ItemType) => void
): ColumnType<ItemType>[] => [
  {
    title: (
      <PlusOutlined
        onClick={onAdd}
        style={{ cursor: "pointer", fontSize: 16 }}
      />
    ),
    dataIndex: "actions",
    key: "actions",
    width: 70,
    align: "center",
    render: (_: any, record: ItemType) => (
      <>
        <FormOutlined
          onClick={() => onEdit(record)}
          style={{ cursor: "pointer" }}
        />
        <DeleteOutlined
          onClick={() => onDelete(record)}
          style={{ cursor: "pointer", marginLeft: 8 }}
        />
      </>
    ),
  },
  {
    title: "Código",
    dataIndex: "codigo",
    key: "codigo",
    filters:
      categories.some((c) => c.items.length > 0) ?
        Array.from(
          new Set(categories.flatMap((c) => c.items.map((i) => i.codigo)))
        ).map((c) => ({ text: c, value: c }))
      : undefined,

    filteredValue: filteredInfo.codigo || null,
    onFilter: (value, record) => record.codigo.includes(value as string),
    sorter: (a, b) => a.codigo.localeCompare(b.codigo),
    sortOrder: sortedInfo.columnKey === "codigo" ? sortedInfo.order : null,
    ellipsis: true,
    width: 120,
  },
  {
    title: "Descripción",
    dataIndex: "descripcion",
    key: "descripcion",
    filters:
      categories.some((c) => c.items.length > 0) ?
        Array.from(
          new Set(categories.flatMap((c) => c.items.map((i) => i.codigo)))
        ).map((t) => ({ text: t, value: t }))
      : undefined,
    filteredValue: filteredInfo.descripcion || null,
    onFilter: (value, record) => record.descripcion.includes(value as string),
    sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    sortOrder: sortedInfo.columnKey === "descripcion" ? sortedInfo.order : null,
    ellipsis: true,
    width: 160,
  },
  {
    title: "Campo1",
    dataIndex: "campo1",
    key: "campo1",
    filteredValue: filteredInfo.tipoFuente || null,
    sortOrder: sortedInfo.columnKey === "tipoFuente" ? sortedInfo.order : null,
  },
  {
    title: "Campo2",
    dataIndex: "campo2",
    key: "campo2",
    filteredValue: filteredInfo.tipoFuente || null,
    sortOrder: sortedInfo.columnKey === "tipoFuente" ? sortedInfo.order : null,
  },
  {
    title: "Campo3",
    dataIndex: "campo3",
    key: "campo3",
    filteredValue: filteredInfo.campo3 || null,
    sortOrder: sortedInfo.columnKey === "campo3" ? sortedInfo.order : null,
  },
  {
    title: "Campo4",
    dataIndex: "campo4",
    key: "campo4",
    filteredValue: filteredInfo.campo4 || null,
    sortOrder: sortedInfo.columnKey === "campo4" ? sortedInfo.order : null,
  },
  {
    title: "Campo5",
    dataIndex: "campo5",
    key: "campo5",
    filteredValue: filteredInfo.campo5 || null,
    sortOrder: sortedInfo.columnKey === "campo5" ? sortedInfo.order : null,
  },
  {
    title: "Campo6",
    dataIndex: "campo6",
    key: "campo6",
    filteredValue: filteredInfo.campo6 || null,
    sortOrder: sortedInfo.columnKey === "campo6" ? sortedInfo.order : null,
  },
  {
    title: "Campo7",
    dataIndex: "campo7",
    key: "campo7",
    filteredValue: filteredInfo.campo7 || null,
    sortOrder: sortedInfo.columnKey === "campo7" ? sortedInfo.order : null,
  },
  {
    title: "Campo8",
    dataIndex: "campo8",
    key: "campo8",
    filteredValue: filteredInfo.campo8 || null,
    sortOrder: sortedInfo.columnKey === "campo8" ? sortedInfo.order : null,
  },
  {
    title: "Campo9",
    dataIndex: "campo9",
    key: "campo9",
    filteredValue: filteredInfo.campo9 || null,
    sortOrder: sortedInfo.columnKey === "campo9" ? sortedInfo.order : null,
  },
  {
    title: "Campo10",
    dataIndex: "campo10",
    key: "campo10",
    filteredValue: filteredInfo.campo10 || null,
    sortOrder: sortedInfo.columnKey === "campo10" ? sortedInfo.order : null,
  },
];
