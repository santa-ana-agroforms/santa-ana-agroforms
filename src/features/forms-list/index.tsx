import React, { useCallback, useEffect, useState } from "react";

import { ArrowUpOutlined, FilterOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  Input,
  Skeleton,
  TableProps,
  Typography,
} from "antd";
import moment from "moment";

import CategoryTables from "@/components/CategoryTables";
import NewFormModal, {
  NewFormValues,
} from "@/components/CategoryTables/components/NewFormModal";
import { categories, getColumns } from "@/components/CategoryTables/data";

import { getCategorias } from "./services/categories.service";
import { getFormularios } from "./services/forms-services";

const { Panel } = Collapse;
const { Title } = Typography;

interface ItemType {
  key: string;
  id: number;
  titulo: string;
  desde: string;
  hasta: string;
  estado: string;
  esPublico: boolean;
  autoEnvio: boolean;
}

interface CategoryType {
  key: string;
  name: string;
  items: ItemType[];
}

interface FormsListsProps {
  onSelectForm: (id: number) => void;
}

type OnChange = NonNullable<TableProps<ItemType>["onChange"]>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
type Filters = Parameters<OnChange>[1];

const FormsLists: React.FC<FormsListsProps> = ({ onSelectForm }) => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [categoriesData, setCategoriesData] = useState<CategoryType[]>([]);

  const handleAdd = () => {
    setOpen(true);
    setSelectedItem(null);
  };

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const handleEdit = useCallback((record: ItemType) => {
    setOpen(true);
    setSelectedItem(record);
    setModalVisible(true);
  }, []);

  const columns = getColumns(
    sortedInfo,
    filteredInfo,
    handleAdd,
    onSelectForm,
    handleEdit
  );

  const handleCreate = (values: NewFormValues) => {
    console.log("Nuevos valores:", values);
    // aquí haces el post o actualización de estado…
  };

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      setLoading(true);
      try {
        // Pedimos en paralelo
        const [cats, forms] = await Promise.all([
          getCategorias({ signal: ac.signal }),
          getFormularios({ signal: ac.signal }),
        ]);

        // Preparamos un diccionario de categorías
        const byCatId = new Map<string, CategoryType>();
        cats.forEach((c) => {
          byCatId.set(c.id, { key: c.id, name: c.nombre, items: [] });
        });

        // Recorremos formularios y los asignamos por categoria (ignorar null)
        forms.forEach((f) => {
          if (!f.categoria) return; // ignorar sin categoría

          const cat = byCatId.get(f.categoria);
          if (!cat) return; // si la categoría no existe en el catálogo, lo ignoramos

          const item: ItemType = {
            key: f.id,
            id: 0,
            titulo: f.nombre,
            desde: moment(f.disponible_desde_fecha).format("DD/MM/YYYY"),
            hasta: moment(f.disponible_hasta_fecha).format("DD/MM/YYYY"),
            estado: f.estado,
            esPublico: f.es_publico,
            autoEnvio: f.auto_envio,
          };

          cat.items.push(item);
        });

        setCategoriesData(Array.from(byCatId.values()));
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error cargando categorías/formularios", err);
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  console.warn(categoriesData);

  return (
    <div className="flex flex-col p-4 w-full gap-7">
      <div className="flex justify-between items-center w-full">
        {/* Botón de Categoría */}
        <Button icon={<FilterOutlined />} className="flex items-center gap-1">
          Categoría <ArrowUpOutlined />
        </Button>

        <Col className="w-60">
          {/* Input de búsqueda */}
          <Input
            placeholder="Introduzca el texto a buscar..."
            className="w-48"
          />
        </Col>
      </div>

      {loading ?
        <>
          <Skeleton active />
          <Skeleton active />
        </>
      : <>
          <CategoryTables<ItemType>
            data={[...categories, ...categoriesData]}
            columns={columns}
            onTableChange={handleChange}
          />

          <NewFormModal
            visible={open}
            onCancel={() => setOpen(false)}
            onCreate={handleCreate}
            initialValues={
              selectedItem ?
                {
                  titulo: selectedItem.titulo,
                  desde: moment(selectedItem.desde, "DD/MM/YYYY"),
                  hasta: moment(selectedItem.hasta, "DD/MM/YYYY"),
                  estado: selectedItem.estado,
                  esPublico: selectedItem.esPublico,
                  autoEnvio: selectedItem.autoEnvio,
                  categoria: categories.find((c) =>
                    c.items.some((i) => i.key === selectedItem.key)
                  )!.key,
                }
              : undefined
            }
          />
        </>
      }
    </div>
  );
};

export default FormsLists;
