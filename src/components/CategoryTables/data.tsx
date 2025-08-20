// src/components/FormsLists/data.ts
import { FormOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";

export interface ItemType {
  key: string;
  id: number;
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

// --- Tus datos estáticos de categoría + filas ---
export const categories: CategoryType[] = [
  {
    key: "pandemia",
    name: "Pandemia",
    items: [
      {
        key: "1",
        id: 11,
        titulo: "BITACORA Pandemia",
        desde: "01/11/2019",
        hasta: "31/10/2020",
        estado: "Activa",
        esPublico: true,
        autoEnvio: false,
      },
      {
        key: "2",
        id: 10,
        titulo: "Resumen Diario Pandemia",
        desde: "18/03/2020",
        hasta: "19/03/2021",
        estado: "Activa",
        esPublico: true,
        autoEnvio: true,
      },
    ],
  },
  {
    key: "otros",
    name: "Otros",
    items: [
      {
        key: "3",
        id: 3,
        titulo: "test",
        desde: "13/06/2019",
        hasta: "30/06/2019",
        estado: "Activa",
        esPublico: false,
        autoEnvio: false,
      },
    ],
  },
];

// --- Función para generar las columnas, recibiendo el estado de sort y filter ---
export const getColumns = (
  sortedInfo: any,
  filteredInfo: any,
  onAdd: () => void,
  onIdClick: (id: number) => void,
  onEdit: (record: ItemType) => void
): ColumnType<ItemType>[] => [
  {
    title: (
      <PlusOutlined
        onClick={onAdd}
        style={{ cursor: "pointer", fontSize: 16 }}
      />
    ),
    dataIndex: "new_form",
    key: "new_form",
    width: 60,
    align: "center",
    render: (_: any, record: ItemType) => (
      <>
        <FormOutlined
          onClick={() => onEdit(record)}
          style={{ cursor: "pointer" }}
        />
      </>
    ),
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
    sorter: (a, b) => a.id - b.id,
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
    filters: Array.from(
      new Set(categories.flatMap((c) => c.items.map((i) => i.titulo)))
    ).map((t) => ({ text: t, value: t })),
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
  },
  {
    title: "Estado",
    dataIndex: "estado",
    key: "estado",
    filters: Array.from(
      new Set(categories.flatMap((c) => c.items.map((i) => i.estado)))
    ).map((e) => ({ text: e, value: e })),
    filteredValue: filteredInfo.estado || null,
    onFilter: (value, record) => record.estado.includes(value as string),
    sorter: (a, b) => a.estado.localeCompare(b.estado),
    sortOrder: sortedInfo.columnKey === "estado" ? sortedInfo.order : null,
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
