// src/components/CategoryTables/data.tsx
import { Fragment } from "react/jsx-runtime";

import { DeleteOutlined, FileAddOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import { ItemType } from ".";

// export interface ItemType {
//   key: string;
//   codigo: string;
//   descripcion: string;
//   tipoFuente: string;
//   conexion?: string;
//   comando?: string;
//   intervalo?: string;
//   ultActualizacion?: string;
//   ultMensaje?: string;
//   datos?: string;
// }

export interface CategoryType {
  key: string;
  name: string;
  items: ItemType[];
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
    items: [
      // {
      //   key: "E1",
      //   codigo: "Lotes",
      //   descripcion: "Listado de Lotes",
      //   tipoFuente: "Externa",
      //   conexion: "Data Source=165…",
      //   comando: "SELECT 0 as IdDato…",
      //   intervalo: "10,00",
      //   ultActualizacion: "29/06/2021",
      //   ultMensaje: "OK",
      //   datos: "Contenido",
      // },
    ],
  },
];

// --- Función para generar las columnas, recibiendo estado de sort/filter y callbacks ---
export const getColumns = (
  sortedInfo: any,
  filteredInfo: any,
  onAdd: () => void,
  // onEdit: (record: ItemType) => void,
  onDelete: (record: ItemType) => void,
  onDatos?: (record: ItemType) => void
): ColumnType<ItemType>[] => [
  {
    title: (
      <>
        <div
          onClick={onAdd}
          title="Crear nuevo formulario"
          className="flex flex-col items-center justify-center cursor-pointer p-2 hover:bg-gray-100 rounded-md"
        >
          <FileAddOutlined className="text-2xl" />
          <span className="text-xs mt-1">Nueva fuente de dato</span>
        </div>
      </>
    ),
    dataIndex: "actions",
    key: "actions",
    width: 100,
    align: "center",
    render: (_: any, record: ItemType) => (
      <Fragment>
        {/* <FormOutlined
          // onClick={() => onEdit(record)}
          style={{ cursor: "pointer" }}
        /> */}
        <DeleteOutlined
          onClick={() => onDelete(record)}
          style={{ cursor: "pointer", marginLeft: 0 }}
        />
      </Fragment>
    ),
  },
  {
    title: "Nombre",
    dataIndex: "nombre",
    key: "nombre",
    filters: Array.from(
      new Set(categories.flatMap((c) => c.items.map((i) => i.nombre)))
    ).map((c) => ({ text: c, value: c })),
    filteredValue: filteredInfo.codigo || null,
    onFilter: (value, record) => record.nombre.includes(value as string),
    sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    sortOrder: sortedInfo.columnKey === "codigo" ? sortedInfo.order : null,
    ellipsis: true,
    width: 160,
  },
  {
    title: "Descripción",
    dataIndex: "descripcion",
    key: "descripcion",
    filters: Array.from(
      new Set(categories.flatMap((c) => c.items.map((i) => i.descripcion)))
    ).map((t) => ({ text: t, value: t })),
    filteredValue: filteredInfo.descripcion || null,
    onFilter: (value, record) => record.descripcion.includes(value as string),
    sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    sortOrder: sortedInfo.columnKey === "descripcion" ? sortedInfo.order : null,
    ellipsis: true,
    width: 170,
  },
  {
    title: "Tipo fuente",
    dataIndex: "tipoFuente",
    key: "tipoFuente",
    filters: Array.from(
      new Set(categories.flatMap((c) => c.items.map((i) => i.tipoFuente)))
    ).map((t) => ({ text: t, value: t })),
    filteredValue: filteredInfo.tipoFuente || null,
    onFilter: (value, record) => record.tipoFuente.includes(value as string),
    sorter: (a, b) => a.tipoFuente.localeCompare(b.tipoFuente),
    sortOrder: sortedInfo.columnKey === "tipoFuente" ? sortedInfo.order : null,
    width: 150,
  },
  // {
  //   title: "Conexión",
  //   dataIndex: "conexion",
  //   key: "conexion",
  //   ellipsis: true,
  //   width: 100,
  // },
  // {
  //   title: "Comando",
  //   dataIndex: "comando",
  //   key: "comando",
  //   ellipsis: true,
  // },
  // {
  //   title: "Intervalo (s)",
  //   dataIndex: "intervalo",
  //   key: "intervalo",
  //   sorter: (a, b) => {
  //     const na = parseFloat(a.intervalo?.replace(",", ".") || "0");
  //     const nb = parseFloat(b.intervalo?.replace(",", ".") || "0");
  //     return na - nb;
  //   },
  //   sortOrder: sortedInfo.columnKey === "intervalo" ? sortedInfo.order : null,
  // },
  // {
  //   title: "Ult. Actualiz.",
  //   dataIndex: "ultActualizacion",
  //   key: "ultActualizacion",
  //   sorter: (a, b) => {
  //     const [d1, m1, y1] = a.ultActualizacion!.split("/").map(Number);
  //     const [d2, m2, y2] = b.ultActualizacion!.split("/").map(Number);
  //     return (
  //       new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime()
  //     );
  //   },
  //   sortOrder:
  //     sortedInfo.columnKey === "ultActualizacion" ? sortedInfo.order : null,
  // },
  // {
  //   title: "Ult. Mensaje",
  //   dataIndex: "ultMensaje",
  //   key: "ultMensaje",
  //   filters: Array.from(
  //     new Set(categories.flatMap((c) => c.items.map((i) => i.ultMensaje || "")))
  //   )
  //     .filter((t) => t)
  //     .map((t) => ({ text: t, value: t })),
  //   filteredValue: filteredInfo.ultMensaje || null,
  //   onFilter: (value, record) => record.ultMensaje === value,
  // },
  {
    title: "Columnas",
    dataIndex: "datos",
    key: "datos",
    ellipsis: true,
    render: (text: string, record: ItemType) => (
      <Typography.Link
        style={{ cursor: "pointer" }}
        onClick={() => onDatos && onDatos(record)}
      >
        {text}
      </Typography.Link>
    ),
  },
];
