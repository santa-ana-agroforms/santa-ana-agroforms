// src/components/DevicesList/DevicesList.tsx
import React, { useEffect, useState } from "react";

import { Column, Line, Pie } from "@ant-design/charts";

interface FormCount {
  fecha: string;
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
interface BarDataTerm {
  terminal: string;
  respuestas: number;
}
interface BarDataWeek {
  dia: string;
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
  const [termData, setTermData] = useState<BarDataTerm[]>([]);
  const [weekData, setWeekData] = useState<BarDataWeek[]>([]);

  useEffect(() => {
    // Simula tu llamada a la API
    setPieData([
      { tipo: "Control de Gastos", porcentaje: 25 },
      { tipo: "Cálculos", porcentaje: 25 },
      { tipo: "Reporte de Embarque", porcentaje: 50 },
    ]);
    setBarData([
      { formulario: "Control gastos de campo", respuestas: 2 },
      { formulario: "Prueba con campos ocultos", respuestas: 2 },
      { formulario: "Reporte de Embarque", respuestas: 4 },
    ]);
    setTermData([
      { terminal: "A4", respuestas: 4 },
      { terminal: "S21", respuestas: 4 },
    ]);
    setWeekData([
      { dia: "lunes", cantidad: 2 },
      { dia: "viernes", cantidad: 2 },
      { dia: "sábado", cantidad: 4 },
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

  const barConfig = {
    data: barData,
    xField: "formulario",
    yField: "respuestas",
    xAxis: { label: { autoRotate: false, style: { fontSize: 12 } } },
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

  const termConfig = {
    data: termData,
    xField: "terminal",
    yField: "respuestas",
    label: { position: "top" },
    xAxis: { label: { autoRotate: false } },
    title: {
      visible: true,
      text: "Por Terminal",
      style: {
        fontSize: 16,
        fontWeight: "bold",
        fill: "red",
      },
    },
    height: 250,
  };

  const weekConfig = {
    data: weekData,
    xField: "dia",
    yField: "cantidad",
    label: { position: "top" },
    xAxis: { label: { autoRotate: false } },
    title: { visible: true, text: "Por día de semana" },
    height: 250,
  };

  return (
    <div className="flex flex-col p-4 w-full gap-4">
      <h2 className="text-amber-400 text-lg font-semibold self-center">
        Formularios recibidos
      </h2>
      <div className="w-full bg-transparent p-4 rounded shadow">
        <Line {...config} />
      </div>

      <div className="flex gap-6">
        {/* gráfica izquierda */}
        <div className="flex-1 bg-white p-4 rounded shadow">
          <Pie {...pieConfig} />
        </div>

        {/* gráfica derecha */}
        <div className="flex-1 bg-white p-4 rounded shadow">
          <Column {...barConfig} />
        </div>
      </div>

      {/* Segunda fila: dos gráficas de barras */}
      <div className="flex gap-6">
        <div className="flex-1 bg-white p-4 rounded shadow">
          <Column {...termConfig} />
        </div>
        <div className="flex-1 bg-white p-4 rounded shadow">
          <Column {...weekConfig} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
