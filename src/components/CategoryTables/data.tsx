// src/components/FormsLists/data.ts
import {
  CopyOutlined,
  DeleteOutlined,
  FormOutlined,
  HolderOutlined,
  MoonOutlined,
  SignatureOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Tooltip } from "antd";
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

const buildRowMenu = (
  record: ItemType,
  onDuplicate: (record: ItemType) => void,
  onDelete: (record: ItemType) => void,
  onSuspend: (record: ItemType) => void
): MenuProps => ({
  items: [
    {
      key: "duplicate",
      icon: <CopyOutlined />,
      label: "Duplicar",
    },
    {
      key: "moon",
      icon: <MoonOutlined />,
      label: "Suspender",
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Eliminar",
      danger: true,
    },
  ],
  onClick: ({ key, domEvent }) => {
    domEvent.stopPropagation();
    if (key === "duplicate") onDuplicate(record);
    if (key === "delete") onDelete(record);
    if (key === "moon") onSuspend(record);
  },
});

const buildFilters = <K extends keyof ItemType>(rows: ItemType[], key: K) =>
  Array.from(new Set(rows.map((r) => String(r[key])))).map((v) => ({
    text: v,
    value: v,
  }));

export const getColumns = (
  rows: ItemType[],
  sortedInfo: any,
  filteredInfo: any,
  onAdd: () => void,
  onIdClick: (id: string | number) => void,
  onEdit: (record: ItemType) => void,
  onDelete: (record: ItemType) => void,
  onDuplicate: (record: ItemType) => void,
  onSuspend: (record: ItemType) => void,
  onAssign: (record: ItemType) => void
): ColumnType<ItemType>[] => [
  {
    title: (
      // ✅ Usar Button en lugar de div con onClick
      <Button
        type="text"
        onClick={onAdd}
        title="Crear nuevo formulario"
        className="flex flex-col items-center justify-center p-2 h-auto"
      >
        <SignatureOutlined className="text-2xl" />
        <span className="text-xs mt-1">Nuevo formulario</span>
      </Button>
    ),
    dataIndex: "new_form",
    key: "new_form",
    width: 100,
    align: "center",
    render: (_: any, record: ItemType) => (
      <>
        <div className="flex flex-row gap-2">
          <Tooltip title="Asignar formulario">
            <SolutionOutlined
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onAssign(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Editar formulario">
            <FormOutlined
              onClick={() => onEdit(record)}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>

          <Tooltip title="Más opciones">
            <Dropdown
              menu={buildRowMenu(record, onDuplicate, onDelete, onSuspend)}
              trigger={["click"]}
              placement="bottomLeft"
              getPopupContainer={(node) => node.parentElement || document.body}
            >
              <HolderOutlined
                style={{ cursor: "pointer" }}
                onClick={(e) => e.preventDefault()}
              />
            </Dropdown>
          </Tooltip>
        </div>
      </>
    ),
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
    render: (value: number, record) => (
      // ✅ Usar Button.Link en lugar de <a> con onClick
      <Button
        type="link"
        onClick={() => onIdClick(record.id)}
        style={{ padding: 0 }}
      >
        {value}
      </Button>
    ),
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