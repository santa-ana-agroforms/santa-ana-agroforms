// src/components/FormsLists/CategoryTables.tsx
import React from "react";

import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Space,
  Table,
  Tooltip,
  type TableColumnType,
  type TableProps,
} from "antd";

import { EditCategoryValues } from "../EditCategoryModal";

const { Panel } = Collapse;

export interface Category<T> {
  key: string;
  name: string;
  items: T[];
}

interface Props<T> {
  data: Category<T>[];
  columns: TableColumnType<T>[];
  onTableChange: TableProps<T>["onChange"];
  /** Abre el modal de edición de categoría */
  onOpenEditModal?: (values: EditCategoryValues) => void;
  /** Abre el modal de eliminación de categoría */
  onOpenDeleteModal?: (categoryKey: string) => void;
  showOptions?: boolean;
}

// 3) Hacemos el componente genérico en T
function CategoryTables<T extends { key: React.Key }>({
  data,
  columns,
  onTableChange,
  onOpenEditModal,
  onOpenDeleteModal,
  showOptions = true,
}: Props<T>) {
  return (
    <>
      {/* 1) Cabecera única */}
      <Table<T>
        columns={columns}
        dataSource={[]}
        pagination={false}
        onChange={onTableChange}
        locale={{ emptyText: "" }}
        scroll={{ y: 0 }}
      />

      <div className="-mt-6">
        <Collapse
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className={
                showOptions ?
                  "transform translate-y-1.5"
                : "transform translate-y-0"
              }
            />
          )}
          items={data.map((cat) => ({
            key: cat.key,
            label: (
              <div className="flex justify-between items-center w-full">
                <span>{`Categoría: ${cat.name}`}</span>

                {showOptions && (
                  <Space size="small">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditModal?.(cat);
                      }}
                    />
                    <Tooltip
                      title={
                        cat.items.length > 0 ?
                          "Para eliminar una categoría, no puede haber formularios."
                        : "Eliminar categoria"
                      }
                    >
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDeleteModal?.(cat.key);
                        }}
                        disabled={cat.items.length > 0}
                      />
                    </Tooltip>
                  </Space>
                )}
              </div>
            ),
            children: (
              <Table<T>
                columns={columns}
                dataSource={cat.items}
                onChange={onTableChange}
                pagination={false}
                showHeader={false}
                rowKey="key"
              />
            ),
          }))}
        />
      </div>
    </>
  );
}
export default CategoryTables;
