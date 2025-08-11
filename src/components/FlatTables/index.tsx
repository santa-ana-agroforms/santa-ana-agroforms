// src/components/FormsLists/FlatCategoryTables.tsx
import React from "react";

import { Table, type TableColumnsType, type TableProps } from "antd";

export interface Category<T> {
  key: string;
  name: string;
  items: T[];
}

interface Props<T extends { key: React.Key }> {
  data: Category<T>[];
  columns: TableColumnsType<T>;
  onTableChange: TableProps<T>["onChange"];
  hideEmptyCategories?: boolean;
}

type ItemWithCategory<T> = T & { category: string };

function FlatTables<T extends { key: React.Key }>({
  data,
  columns,
  onTableChange,
  hideEmptyCategories = false,
}: Props<T>) {
  // 1. Aplanar datos y adjuntar categoría
  const flattenedData: ItemWithCategory<T>[] = data.flatMap((cat) => {
    if (hideEmptyCategories && (!cat.items || cat.items.length === 0)) {
      return [];
    }
    return cat.items.map((item) => ({ ...item, category: cat.name }));
  });

  // 2. Si quieres mostrar separadores de categoría, puedes inyectar una columna virtual
  const columnsWithCategory: TableColumnsType<ItemWithCategory<T>> = [
    // Reusar columnas originales; hay que ajustar su tipado porque ahora el data source tiene category agregado
    ...(columns.map((col) => ({
      ...col,
      // si usan dataIndex y luego acceden a la propiedad clave, no se rompe por el extra category
    })) as TableColumnsType<ItemWithCategory<T>>),
  ];

  // 3. Opcional: color de fila para “inicio de categoría” para separarla visualmente
  const rowClassName = (_record: ItemWithCategory<T>, index?: number) => {
    if (index === undefined) return "";
    const current = flattenedData[index];
    const prev = flattenedData[index - 1];
    if (index === 0 || prev?.category !== current.category) {
      return "border-t border-gray-300"; // puedes ajustar clases Tailwind aquí
    }
    return "";
  };

  return (
    <Table<ItemWithCategory<T>>
      columns={columnsWithCategory}
      dataSource={flattenedData}
      pagination={false}
      onChange={onTableChange as any}
      rowKey="key"
      rowClassName={rowClassName}
      // sticky si quieres que el header se fije:
      // sticky
    />
  );
}

export default FlatTables;
