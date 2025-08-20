// src/components/FormsLists/CategoryTables.tsx
import React from "react";

import { Collapse, Table, type TableColumnType, type TableProps } from "antd";

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
}

// 3) Hacemos el componente genérico en T
function CategoryTables<T extends { key: React.Key }>({
  data,
  columns,
  onTableChange,
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
        {/* 2) Collapse con header vacío */}
        <Collapse
          items={data.map((cat) => ({
            key: cat.key,
            label: `Categoría: ${cat.name}`,
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
