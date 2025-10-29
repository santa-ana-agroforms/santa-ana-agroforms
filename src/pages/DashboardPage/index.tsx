// src/components/DevicesList/DevicesList.tsx
import React, { useEffect, useState } from "react";

import { Column, Line, Pie } from "@ant-design/charts";
import { Skeleton } from "antd";

import { useDashboardResumen } from "@/features/dashboard/hook/useDashboardResumen";

interface ActiveUsersData {
  estado: "Activos" | "Inactivos";
  cantidad: number;
}

interface UserTermCount {
  usuario: string;
  cantidad: number;
}

interface LastAccessData {
  terminal: string; // o user
  diasSinAcceso: number; // o fecha transformada a días, horas, etc.
}

const DashboardPage: React.FC = () => {
  const [lastAccess, setLastAccess] = useState<LastAccessData[]>([]);

  const [userTermCounts, setUserTermCounts] = useState<UserTermCount[]>([]);

  const { data: dashboard, isLoading, isError } = useDashboardResumen();

  console.warn("Dashboard data:", dashboard);

  useEffect(() => {
    // 2) Último acceso (ejemplo: días desde el último acceso por terminal)
    setLastAccess([
      { terminal: "A4", diasSinAcceso: 2 },
      { terminal: "S21", diasSinAcceso: 7 },
      { terminal: "ZFold", diasSinAcceso: 1 },
      { terminal: "MotoG", diasSinAcceso: 15 },
    ]);

    setUserTermCounts([
      { usuario: "Jacqueline", cantidad: 4 },
      { usuario: "Gerardo", cantidad: 2 },
      { usuario: "Francis", cantidad: 5 },
      { usuario: "Luisa", cantidad: 3 },
      { usuario: "Ana", cantidad: 1 },
    ]);
  }, []);

  // Grafica de pastel: Formularios por estado
  // Normaliza y agrupa estados (porque hay "activo" y "Activo")
  const estadosRaw = dashboard?.formularios?.por_categoria ?? [];

  const estadosNormalizados = estadosRaw.reduce(
    (acc, curr) => {
      const estado = curr.categoria_nombre.trim().toLowerCase();
      acc[estado] = (acc[estado] ?? 0) + curr.total;
      return acc;
    },
    {} as Record<string, number>
  );

  // 🔹 Convertimos a arreglo con totales numéricos
  const pieData = Object.entries(estadosNormalizados).map(
    ([estado, total]) => ({
      tipo: estado.charAt(0).toUpperCase() + estado.slice(1),
      cantidad: total, // usamos total directo, no porcentaje
    })
  );

  const pieConfig = {
    data: pieData,
    angleField: "cantidad",
    colorField: "tipo",
    label: {
      text: "cantidad",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    tooltip: {
      showTitle: true,
      title: (datum: any) => `Tipo: ${datum.tipo}`,
      formatter: (datum: any) => `${datum.tipo}: ${datum.cantidad}`,
    },

    autoFit: true,
  };

  // Configuración de la gráfica de líneas
  const dataChart =
    dashboard?.entradas?.recibidos_por_fecha.map((item) => ({
      fecha: item.periodo,
      cantidad: item.total,
    })) ?? [];

  const config = {
    data: dataChart,
    xField: "fecha",
    yField: "cantidad",
    autoFit: true,
    shapeField: "smooth",
    xAxis: {
      label: {
        formatter: (val: string) => val.slice(5), // muestra solo MM-DD
      },
    },
    point: {
      size: 4,
      shape: "circle",
      style: { fill: "#1890ff" },
    },
    tooltip: {
      showTitle: true,
      title: (datum: any) => `Fecha: ${datum.fecha}`,
      formatter: (datum: any) => ({
        name: "Formularios",
        value: datum.cantidad,
      }),
    },
    smooth: true,
    height: 200,
  };

  const userTermsBarConfig = {
    data: userTermCounts,
    xField: "usuario", // categorías en X
    yField: "cantidad", // valor numérico en Y
    label: { position: "top" },
    xAxis: { label: { autoRotate: false } },
    meta: { cantidad: { alias: "Terminales" } },
    height: 500,
    // opcionales para estética/legibilidad:
    minColumnWidth: 24,
  };

  const lastAccessConfig = {
    data: lastAccess,
    xField: "terminal", // o "usuario"
    yField: "diasSinAcceso", // menor es mejor (más reciente)
    label: { position: "top" },
    xAxis: { label: { autoRotate: false } },
    meta: { diasSinAcceso: { alias: "Días sin acceso" } },
    height: 250,
  };

  // NUEVO: Pie Formularios Activos/Inactivos

  // 🔹 Datos de formularios por estado
  const estadosForms = dashboard?.formularios?.por_estado ?? [];

  // 🔹 Clasificamos en "Activos" o "Inactivos"
  let activosCount = 0;
  let inactivosCount = 0;

  for (const item of estadosForms) {
    const estado = item.estado.trim().toLowerCase();
    if (estado === "suspendido") {
      inactivosCount += item.total;
    } else {
      activosCount += item.total;
    }
  }

  // 🔹 Creamos la data para el gráfico
  const activeFormsData = [
    { estado: "Activos", cantidad: activosCount },
    { estado: "Inactivos", cantidad: inactivosCount },
  ];

  const pieActiveFormsConfig = {
    data: activeFormsData,
    angleField: "cantidad",
    colorField: "estado",
    label: { text: "cantidad" },
    legend: { position: "right" },
    height: 250,
    statistic: { title: { content: "Formularios" } },
  };

  if (isError) return <p>Ocurrió un error al cargar el resumen</p>;

  return (
    <div className="flex flex-col p-4 w-full gap-4">
      <h2 className="text-amber-400 text-lg font-semibold self-center">
        Dashboard
      </h2>

      {isLoading ?
        <>
          <Skeleton active />
          <Skeleton active />
        </>
      : <React.Fragment>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <div className="text-xs text-gray-500">Usuarios Totales</div>
              <div className="text-2xl font-semibold">
                {dashboard?.usuarios.total}
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-xs text-gray-500">Usuarios Activos</div>
              <div className="text-2xl font-semibold">
                {dashboard?.usuarios.activos}
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-xs text-gray-500">% Activos</div>
              <div className="text-2xl font-semibold">
                {dashboard?.usuarios.prc_activos}%
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full bg-transparent p-4 rounded shadow gap-6">
            <h3 className="text-base font-semibold mb-2">
              Cantidad de formularios por fecha de creación
            </h3>
            <Line {...config} />
          </div>

          <div className="flex gap-6">
            {/* gráfica izquierda */}
            <div className="flex-1 bg-white p-4 rounded shadow">
              <h3 className="text-base font-semibold mb-2">
                Cantidad de formularios por categoria
              </h3>
              <Pie {...pieConfig} />
            </div>

            {/* gráfica derecha */}
            <div className="flex-1 bg-white p-4 rounded shadow">
              <h3 className="text-base font-semibold mb-2">
                Cantidad de terminales por usuario (pendiente)
              </h3>
              <Column {...userTermsBarConfig} />
            </div>
          </div>

          {/* Fila 2: izquierda Último acceso (barra); derecha Formularios activos/inactivos (pie) */}
          <div className="flex gap-6">
            <div className="flex-1 bg-white p-4 rounded shadow">
              <h3 className="text-base font-semibold mb-2">
                Cantidad de uso por terminal (pendiente)
              </h3>
              <Column {...lastAccessConfig} />
            </div>
            <div className="flex-1 bg-white p-4 rounded shadow">
              <h3 className="text-base font-semibold mb-2">
                Cantidad de formularios activos e inactivos
              </h3>
              <Pie {...pieActiveFormsConfig} />
            </div>
          </div>
        </React.Fragment>
      }
    </div>
  );
};

export default DashboardPage;
