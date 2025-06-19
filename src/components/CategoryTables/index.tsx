// src/components/FormsLists/CategoryTables.tsx
import React from 'react';
import { Collapse, Table } from 'antd';
import type { TableProps, TableColumnsType } from 'antd';
import { CategoryType, ItemType } from './data';

const { Panel } = Collapse;

interface Props {
  data: CategoryType[];
  columns: TableColumnsType<ItemType>;
  onTableChange: TableProps<ItemType>['onChange'];
}

const CategoryTables: React.FC<Props> = ({ data, columns, onTableChange }) => (
  <>
    {/* 1) Cabecera única */}
    <Table<ItemType>
      columns={columns}
      dataSource={[]}
      pagination={false}
      onChange={onTableChange}
      locale={{ emptyText: '' }}
      scroll={{ y: 0 }}
    />

    <div className='-mt-6'>
      {/* 2) Collapse con header vacío */}
      <Collapse>
        {data.map((cat) => (
          <Panel header={`Categoría: ${cat.name}`} key={cat.key}>
            {/* 3) Tabla con datos, filtros y orden */}
            <Table<ItemType>
              columns={columns}
              dataSource={cat.items}
              onChange={onTableChange}
              pagination={false}
              showHeader={false}
              rowKey="key"
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  </>
);

export default CategoryTables;
