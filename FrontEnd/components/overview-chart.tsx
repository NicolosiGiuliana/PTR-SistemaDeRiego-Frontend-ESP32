"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Estado global para los datos históricos
let historicalData = {
  temperature: Array(7).fill(null),
  humidity: Array(7).fill(null),
  light: Array(7).fill(null),
  timestamps: Array(7).fill(null)
}

// Función para actualizar los datos históricos
export const updateHistoricalData = (newData: { temperature: number; humidity: number; light: number }) => {
  historicalData.temperature.shift()
  historicalData.humidity.shift()
  historicalData.light.shift()
  historicalData.timestamps.shift()

  const now = new Date()
  const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

  historicalData.temperature.push(newData.temperature)
  historicalData.humidity.push(newData.humidity)
  historicalData.light.push(newData.light)
  historicalData.timestamps.push(timeString)
}

type DataType = "temperature" | "humidity" | "light";

// Generar datos para las gráficas basados en el historial
const generateChartData = (type: DataType, mini = false): ChartData<"line"> => {
  // Filtrar valores nulos
  const labels = historicalData.timestamps.filter((_, i) => historicalData[type][i] !== null)
  const data = historicalData[type].filter((v: number | null) => v !== null) as number[]

  let label = ""
  let borderColor = ""
  let backgroundColor = ""
  let min = 0
  let max = 0
  let stepSize = 0

  switch (type) {
    case "temperature":
      label = "Temperatura (°C)"
      borderColor = "#4ade80"
      backgroundColor = "rgba(74, 222, 128, 0.2)"
      min = 0
      max = 40
      stepSize = 5
      break
    case "humidity":
      label = "Humedad (%)"
      borderColor = "#4ade80"
      backgroundColor = "rgba(74, 222, 128, 0.2)"
      min = 0
      max = 100
      stepSize = 10
      break
    case "light":
      label = "Intensidad de Luz (lux)"
      borderColor = "#4ade80"
      backgroundColor = "rgba(74, 222, 128, 0.2)"
      min = 0
      max = 3000
      stepSize = 500
      break
    default:
      break
  }

  return {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor,
        backgroundColor,
        tension: 0.3,
        pointRadius: mini ? 0 : 3,
        borderWidth: mini ? 2 : 2,
      },
    ],
  }
}

const getOptions = (type: DataType, mini = false) => {
  let min = 0
  let max = 0
  let stepSize = 0

  switch (type) {
    case "temperature":
      min = 0
      max = 40
      stepSize = 5
      break
    case "humidity":
      min = 0
      max = 100
      stepSize = 10
      break
    case "light":
      min = 0
      max = 3000
      stepSize = 500
      break
    default:
      break
  }

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !mini,
        position: "top" as const,
      },
      tooltip: {
        enabled: !mini,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
        },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        min: min,
        max: max,
        ticks: {
          stepSize: stepSize,
        },
        grid: {
          display: true,
        },
      },
    },
    elements: {
      point: {
        radius: mini ? 0 : 3,
      },
    },
  }
}

export function OverviewChart({ type, mini = false }: { type: DataType; mini?: boolean }) {
  const [chartData, setChartData] = useState<ChartData<"line">>(generateChartData(type, mini))
  const options = getOptions(type, mini)

  // Actualizar la gráfica cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateChartData(type, mini))
    }, 2000)

    return () => clearInterval(interval)
  }, [type, mini])

  return (
    <div className={mini ? "h-full w-full" : "h-[300px]"}>
      <Line options={options} data={chartData} />
    </div>
  )
}
