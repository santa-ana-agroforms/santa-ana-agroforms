// src/components/FormsLists/data.ts
import { DeleteOutlined, FormOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";

export interface ItemType {
  key: string;
  id: string | number;
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

/** Utilidad para crear filtros únicos a partir de las filas */
const buildFilters = <K extends keyof ItemType>(rows: ItemType[], key: K) =>
  Array.from(new Set(rows.map((r) => String(r[key])))).map((v) => ({
    text: v,
    value: v,
  }));

// --- Función para generar las columnas, recibiendo el estado de sort y filter ---
export const getColumns = (
  rows: ItemType[],
  sortedInfo: any,
  filteredInfo: any,
  onAdd: () => void,
  onIdClick: (id: string | number) => void,
  onEdit: (record: ItemType) => void,
  onDelete: (record: ItemType) => void
): ColumnType<ItemType>[] => [
  {
    title: (
      <>
        <PlusOutlined
          onClick={onAdd}
          style={{ cursor: "pointer", fontSize: 16 }}
        />
      </>
    ),
    dataIndex: "new_form",
    key: "new_form",
    width: 90,
    align: "center",
    render: (_: any, record: ItemType) => (
      <>
        <div className="flex flex-row gap-2">
          <FormOutlined
            onClick={() => onEdit(record)}
            style={{ cursor: "pointer" }}
          />

          <DeleteOutlined
            onClick={() => onDelete(record)}
            style={{ cursor: "pointer", fontSize: 16 }}
          />
        </div>
      </>
    ),
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    sorter: (a, b) => {
      const an = Number(a.id);
      const bn = Number(b.id);
      return Number.isFinite(an) && Number.isFinite(bn) ?
          an - bn
        : String(a.id).localeCompare(String(b.id));
    },
    sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
    render: (value: number, record) => (
      <a
        onClick={() => onIdClick(record.id)}
        style={{ cursor: "pointer", color: "#1890ff" }}
      >
        {value}
      </a>
    ),
    ellipsis: true,
  },
  {
    title: "Título",
    dataIndex: "titulo",
    key: "titulo",
    filters: buildFilters(rows, "titulo"),
    filteredValue: filteredInfo.titulo || null,
    onFilter: (value, record) => record.titulo.includes(value as string),
    sorter: (a, b) => a.titulo.localeCompare(b.titulo),
    sortOrder: sortedInfo.columnKey === "titulo" ? sortedInfo.order : null,
    ellipsis: true,
  },
  {
    title: "Desde",
    dataIndex: "desde",
    key: "desde",
    sorter: (a, b) => {
      const [d1, m1, y1] = a.desde.split("/").map(Number);
      const [d2, m2, y2] = b.desde.split("/").map(Number);
      return (
        new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime()
      );
    },
    sortOrder: sortedInfo.columnKey === "desde" ? sortedInfo.order : null,
    width: 125,
  },
  {
    title: "Hasta",
    dataIndex: "hasta",
    key: "hasta",
    render: (t) => <span style={{ background: "#ffe58f" }}>{t}</span>,
    sorter: (a, b) => {
      const [d1, m1, y1] = a.hasta.split("/").map(Number);
      const [d2, m2, y2] = b.hasta.split("/").map(Number);
      return (
        new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime()
      );
    },
    sortOrder: sortedInfo.columnKey === "hasta" ? sortedInfo.order : null,
    width: 125,
  },
  {
    title: "Estado",
    dataIndex: "estado",
    key: "estado",
    filters: buildFilters(rows, "estado"),
    filteredValue: filteredInfo.estado || null,
    onFilter: (value, record) => record.estado.includes(value as string),
    sorter: (a, b) => a.estado.localeCompare(b.estado),
    sortOrder: sortedInfo.columnKey === "estado" ? sortedInfo.order : null,
    width: 160,
  },
  {
    title: "¿Es Público?",
    dataIndex: "esPublico",
    key: "esPublico",
    width: 140,
    filters: [
      { text: "Sí", value: true },
      { text: "No", value: false },
    ],
    filteredValue: filteredInfo.esPublico || null,
    onFilter: (value, record) => record.esPublico === value,
    sorter: (a, b) => Number(a.esPublico) - Number(b.esPublico),
    sortOrder: sortedInfo.columnKey === "esPublico" ? sortedInfo.order : null,
    render: (val) => (val ? "✔️" : ""),
  },
  {
    title: "¿Auto Envío?",
    dataIndex: "autoEnvio",
    key: "autoEnvio",
    width: 140,
    filters: [
      { text: "Sí", value: true },
      { text: "No", value: false },
    ],
    filteredValue: filteredInfo.autoEnvio || null,
    onFilter: (value, record) => record.autoEnvio === value,
    sorter: (a, b) => Number(a.autoEnvio) - Number(b.autoEnvio),
    sortOrder: sortedInfo.columnKey === "autoEnvio" ? sortedInfo.order : null,
    render: (val) => (val ? "✔️" : ""),
  },
];
