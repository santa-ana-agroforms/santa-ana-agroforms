// src/components/CategoryTables/data.tsx
import {
  DeleteOutlined,
  FileAddOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
import type { ColumnType } from "antd/es/table";

export interface ItemType {
  key: string;
  codigo: string;
  descripcion: string;
  tipoFuente: string;
  conexion?: string;
  comando?: string;
  intervalo?: string;
  ultActualizacion?: string;
  ultMensaje?: string;
  datos?: string;
}

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
    items: [
      {
        key: "1",
        codigo: "Cabezal",
        descripcion: "Cabezal",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "04/04/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "2",
        codigo: "Confirmacion",
        descripcion: "Confirmacion",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "04/04/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "3",
        codigo: "Ejemplo",
        descripcion: "Ejemplo",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "05/12/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "4",
        codigo: "Empresas",
        descripcion: "Empresas Cliente",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "04/04/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "5",
        codigo: "Equipos",
        descripcion: "Lista de Equipos",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "25/11/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "6",
        codigo: "Flujo",
        descripcion: "Flujo Aprobaciones",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "04/11/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "7",
        codigo: "IPGact",
        descripcion: "Actividades Palo…",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "25/11/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "8",
        codigo: "IPGtp",
        descripcion: "Tiempos Perdido…",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "25/11/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "9",
        codigo: "Lotes",
        descripcion: "Listado de Lotes…",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "04/04/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "10",
        codigo: "Rutas de Envíos",
        descripcion: "Envíos de correos",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "18/09/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "11",
        codigo: "SubContratado",
        descripcion: "SubContratado",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "04/04/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "12",
        codigo: "Supervisor",
        descripcion: "Supervisor",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "04/04/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "13",
        codigo: "Supervisores",
        descripcion: "Lista de Supervisores",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "04/04/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "14",
        codigo: "Transportista",
        descripcion: "Transportista",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "04/04/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "15",
        codigo: "Trayecto",
        descripcion: "Trayecto",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "04/04/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
      {
        key: "16",
        codigo: "Vagones",
        descripcion: "Código de Vagones",
        tipoFuente: "Local",
        conexion: "",
        comando: "",
        intervalo: "",
        ultActualizacion: "04/04/2020",
        ultMensaje: "",
        datos: "Contenido",
      },
    ],
  },
  {
    key: "externa",
    name: "Externa",
    items: [
      {
        key: "E1",
        codigo: "Lotes",
        descripcion: "Listado de Lotes",
        tipoFuente: "Externa",
        conexion: "Data Source=165…",
        comando: "SELECT 0 as IdDato…",
        intervalo: "10,00",
        ultActualizacion: "29/06/2021",
        ultMensaje: "OK",
        datos: "Contenido",
      },
    ],
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
    width: 110,
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
    filters: Array.from(
      new Set(categories.flatMap((c) => c.items.map((i) => i.codigo)))
    ).map((c) => ({ text: c, value: c })),
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
    filters: Array.from(
      new Set(categories.flatMap((c) => c.items.map((i) => i.descripcion)))
    ).map((t) => ({ text: t, value: t })),
    filteredValue: filteredInfo.descripcion || null,
    onFilter: (value, record) => record.descripcion.includes(value as string),
    sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    sortOrder: sortedInfo.columnKey === "descripcion" ? sortedInfo.order : null,
    ellipsis: true,
    width: 160,
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
  },
  {
    title: "Conexión",
    dataIndex: "conexion",
    key: "conexion",
    ellipsis: true,
    width: 100,
  },
  {
    title: "Comando",
    dataIndex: "comando",
    key: "comando",
    ellipsis: true,
  },
  {
    title: "Intervalo (s)",
    dataIndex: "intervalo",
    key: "intervalo",
    sorter: (a, b) => {
      const na = parseFloat(a.intervalo?.replace(",", ".") || "0");
      const nb = parseFloat(b.intervalo?.replace(",", ".") || "0");
      return na - nb;
    },
    sortOrder: sortedInfo.columnKey === "intervalo" ? sortedInfo.order : null,
  },
  {
    title: "Ult. Actualiz.",
    dataIndex: "ultActualizacion",
    key: "ultActualizacion",
    sorter: (a, b) => {
      const [d1, m1, y1] = a.ultActualizacion!.split("/").map(Number);
      const [d2, m2, y2] = b.ultActualizacion!.split("/").map(Number);
      return (
        new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime()
      );
    },
    sortOrder:
      sortedInfo.columnKey === "ultActualizacion" ? sortedInfo.order : null,
  },
  {
    title: "Ult. Mensaje",
    dataIndex: "ultMensaje",
    key: "ultMensaje",
    filters: Array.from(
      new Set(categories.flatMap((c) => c.items.map((i) => i.ultMensaje || "")))
    )
      .filter((t) => t)
      .map((t) => ({ text: t, value: t })),
    filteredValue: filteredInfo.ultMensaje || null,
    onFilter: (value, record) => record.ultMensaje === value,
  },
  {
    title: "Datos",
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
