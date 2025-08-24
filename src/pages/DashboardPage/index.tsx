// src/components/DevicesList/DevicesList.tsx
import React, { useEffect, useState } from "react";

import { Column, Line, Pie } from "@ant-design/charts";

interface FormCount {
  fecha: string;
  cantidad: number;
}

interface ActiveUsersData {
  estado: "Activos" | "Inactivos";
  cantidad: number;
}

interface PieData {
  tipo: string;
  porcentaje: number;
}
interface BarData {
  formulario: string;
  respuestas: number;
}

interface UserTermCount {
  usuario: string;
  cantidad: number;
}

interface LastAccessData {
  terminal: string; // o user
  diasSinAcceso: number; // o fecha transformada a días, horas, etc.
}
interface ActiveFormsData {
  estado: "Activos" | "Inactivos";
  cantidad: number;
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<FormCount[]>([
    { fecha: "2021-06-05", cantidad: 10 },
    { fecha: "2021-06-06", cantidad: 8 },
    { fecha: "2021-06-07", cantidad: 6 },
    { fecha: "2021-06-08", cantidad: 4 },
    { fecha: "2021-06-09", cantidad: 5 },
    { fecha: "2021-06-10", cantidad: 7 },
    { fecha: "2021-06-11", cantidad: 3 },
    { fecha: "2021-06-12", cantidad: 2 },
    { fecha: "2021-06-13", cantidad: 1 },
    { fecha: "2021-06-14", cantidad: 0 },
    { fecha: "2021-06-15", cantidad: 2 },
    { fecha: "2021-06-16", cantidad: 3 },
    { fecha: "2021-06-17", cantidad: 1 },
    { fecha: "2021-06-18", cantidad: 0 },
  ]);

  const [pieData, setPieData] = useState<PieData[]>([]);
  const [barData, setBarData] = useState<BarData[]>([]);

  const [activeUsers, setActiveUsers] = useState<ActiveUsersData[]>([]);
  const [lastAccess, setLastAccess] = useState<LastAccessData[]>([]);
  const [activeForms, setActiveForms] = useState<ActiveFormsData[]>([]);

  const [userTermCounts, setUserTermCounts] = useState<UserTermCount[]>([]);

  useEffect(() => {
    // Simula tu llamada a la API
    setPieData([
      { tipo: "Control de Gastos", porcentaje: 25 },
      { tipo: "Cálculos", porcentaje: 25 },
      { tipo: "Reporte de Embarque", porcentaje: 50 },
    ]);

    setActiveUsers([
      { estado: "Activos", cantidad: 42 },
      { estado: "Inactivos", cantidad: 8 },
    ]);
    // 2) Último acceso (ejemplo: días desde el último acceso por terminal)
    setLastAccess([
      { terminal: "A4", diasSinAcceso: 2 },
      { terminal: "S21", diasSinAcceso: 7 },
      { terminal: "ZFold", diasSinAcceso: 1 },
      { terminal: "MotoG", diasSinAcceso: 15 },
    ]);

    // 3) Formularios activos/inactivos
    setActiveForms([
      { estado: "Activos", cantidad: 12 },
      { estado: "Inactivos", cantidad: 5 },
    ]);

    setUserTermCounts([
      { usuario: "Jacqueline", cantidad: 4 },
      { usuario: "Gerardo", cantidad: 2 },
      { usuario: "Francis", cantidad: 5 },
      { usuario: "Luisa", cantidad: 3 },
      { usuario: "Ana", cantidad: 1 },
    ]);
  }, []);

  const pieConfig = {
    data: pieData,
    angleField: "porcentaje",
    colorField: "tipo",
    label: {
      text: "porcentaje",
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

    autoFit: true,
  };

  const config = {
    data,
    xField: "fecha",
    yField: "cantidad",
    autoFit: true,
    shapeField: "smooth",
    xAxis: {
      // Formatear etiqueta de fecha si hace falta
      label: { formatter: (val: string) => val.slice(5) },
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
  const pieActiveFormsConfig = {
    data: activeForms,
    angleField: "cantidad",
    colorField: "estado",
    label: { text: "cantidad" },
    legend: { position: "right" },
    height: 250,
    statistic: { title: { content: "Formularios" } },
  };

  const totalUsuarios = activeUsers.reduce((a, b) => a + b.cantidad, 0);
  const activos =
    activeUsers.find((d) => d.estado === "Activos")?.cantidad ?? 0;
  const pctActivos =
    totalUsuarios ? Math.round((activos / totalUsuarios) * 100) : 0;

  return (
    <div className="flex flex-col p-4 w-full gap-4">
      <h2 className="text-amber-400 text-lg font-semibold self-center">
        Dashboard
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-xs text-gray-500">Usuarios Totales</div>
          <div className="text-2xl font-semibold">{totalUsuarios}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-xs text-gray-500">Usuarios Activos</div>
          <div className="text-2xl font-semibold">{activos}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-xs text-gray-500">% Activos</div>
          <div className="text-2xl font-semibold">{pctActivos}%</div>
        </div>
      </div>

      <div className="flex flex-col w-full bg-transparent p-4 rounded shadow gap-6">
        <h3 className="text-base font-semibold mb-2">
          Cantidad de formularios recibidos por fecha
        </h3>
        <Line {...config} />
      </div>

      <div className="flex gap-6">
        {/* gráfica izquierda */}
        <div className="flex-1 bg-white p-4 rounded shadow">
          <h3 className="text-base font-semibold mb-2">
            Respuestas por tipo de formulario
          </h3>
          <Pie {...pieConfig} />
        </div>

        {/* gráfica derecha */}
        <div className="flex-1 bg-white p-4 rounded shadow">
          <h3 className="text-base font-semibold mb-2">
            Cantidad de terminales por usuario
          </h3>
          <Column {...userTermsBarConfig} />
        </div>
      </div>

      {/* Fila 2: izquierda Último acceso (barra); derecha Formularios activos/inactivos (pie) */}
      <div className="flex gap-6">
        <div className="flex-1 bg-white p-4 rounded shadow">
          <h3 className="text-base font-semibold mb-2">
            Cantidad de uso por terminal
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
    </div>
  );
};

export default DashboardPage;
