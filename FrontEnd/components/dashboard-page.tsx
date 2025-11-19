"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewChart, updateHistoricalData } from "@/components/overview-chart"
import { AlertCircle } from "lucide-react"

// Valores por defecto
const defaultConfig = {
  temp: { min: 17, max: 28, critical: 30 },
  humidity: { min: 45, max: 75, critical: 30 },
  light: { min: 350, max: 750, critical: 2000 },
  irrigation: {
    enabled: true,
    humidityThreshold: 50,
    tempThreshold: 25,
    lightThreshold: 1500
  }
}

// Simulación de datos
const generateData = (config: typeof defaultConfig) => {
  const temperature = Math.floor(Math.random() * 15) + 15 // 15-30°C
  const humidity = Math.floor(Math.random() * 60) + 20 // 20-80%
  const light = Math.floor(Math.random() * 2000) + 500 // 500-2500 unidades

  const irrigationActive = config.irrigation.enabled &&
    humidity < config.irrigation.humidityThreshold &&
    temperature > config.irrigation.tempThreshold &&
    light < config.irrigation.lightThreshold

  return { temperature, humidity, light, irrigationActive }
}

export function DashboardPage() {
  const [config, setConfig] = useState(defaultConfig)
  const [systemData, setSystemData] = useState(generateData(defaultConfig))
  const [systemStatus, setSystemStatus] = useState("Normal")


  // Websocket

  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket("wss://desktop-5ldkqva.taila9e2ab.ts.net/ws")

    ws.current.onopen = () => {
      console.log("Conectado al servidor WebSocket")
    }

    ws.current.onmessage = (event) => {
      const jsonData = JSON.parse(event.data)
      console.log("WS data:", jsonData)
    }

    ws.current.onclose = () => {
      console.log("Conexión cerrada")
    }

    return () => {
      ws.current?.close()
    }
  }, [])

  // Funciones para enviar comandos al WS

  const sendCommand = (data: object) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data))
    }
  }

  const autoOn = () => sendCommand({ AUTO_ON: true })
  const autoOff = () => sendCommand({ AUTO_OFF: true })

  // Escuchar cambios en irrigationActive para enviar comando automático

  useEffect(() => {
    if (systemData.irrigationActive) {
      autoOn()
    } else {
      autoOff()
    }
  }, [systemData.irrigationActive])

  useEffect(() => {
    const tempConfig = JSON.parse(localStorage.getItem("tempConfig") || "{}");
    const humidityConfig = JSON.parse(localStorage.getItem("humidityConfig") || "{}");
    const lightConfig = JSON.parse(localStorage.getItem("lightConfig") || "{}");
    const irrigationConfig = JSON.parse(localStorage.getItem("irrigationConfig") || "{}");

    setConfig({
      temp: {
        min: tempConfig.tempMin || defaultConfig.temp.min,
        max: tempConfig.tempMax || defaultConfig.temp.max,
        critical: tempConfig.tempCritical || defaultConfig.temp.critical
      },
      humidity: {
        min: humidityConfig.humidityMin || defaultConfig.humidity.min,
        max: humidityConfig.humidityMax || defaultConfig.humidity.max,
        critical: humidityConfig.humidityCritical || defaultConfig.humidity.critical
      },
      light: {
        min: lightConfig.lightMin || defaultConfig.light.min,
        max: lightConfig.lightMax || defaultConfig.light.max,
        critical: lightConfig.lightCritical || defaultConfig.light.critical
      },
      irrigation: {
        enabled: irrigationConfig.irrigationEnabled ?? defaultConfig.irrigation.enabled,
        humidityThreshold: irrigationConfig.irrigationHumidityThreshold || defaultConfig.irrigation.humidityThreshold,
        tempThreshold: irrigationConfig.irrigationTempThreshold || defaultConfig.irrigation.tempThreshold,
        lightThreshold: irrigationConfig.irrigationLightThreshold || defaultConfig.irrigation.lightThreshold
      }
    });
  }, []);

  // Actualizar el estado del sistema basado en los datos y la configuración
  useEffect(() => {
    if (systemData.temperature > config.temp.critical ||
      systemData.humidity < config.humidity.critical ||
      systemData.light > config.light.critical) {
      setSystemStatus("Crítico")
    } else if (systemData.temperature > config.temp.max ||
      systemData.humidity < config.humidity.min ||
      systemData.light > config.light.max) {
      setSystemStatus("Advertencia")
    } else {
      setSystemStatus("Normal")
    }
  }, [systemData, config])

  // Inicializar el historial con el primer valor real
  useEffect(() => {
    const firstData = generateData(config)
    setSystemData(firstData)
    for (let i = 0; i < 7; i++) {
      updateHistoricalData(firstData)
    }
  }, [config])

  // Simular actualización de datos cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateData(config)
      setSystemData(newData)
      updateHistoricalData(newData)
    }, 5000)

    return () => clearInterval(interval)
  }, [config])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Crítico":
        return "text-white bg-[#003344] hover:bg-[#003344]"
      case "Advertencia":
        return "text-[#003344] bg-amber-100 hover:bg-amber-100"
      default:
        return "text-[#003344] bg-green-100 hover:bg-green-100"
    }
  }

  return (
    <>
      <div className="flex min-h-screen bg-[#87CEEB] overflow-hidden w-full grow">
        <div className="flex-1 p-6 md:p-8 bg-white m-4 rounded-3xl overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#003344]">
                  Sistema de Monitoreo Agrícola Inteligente
                </h1>
              </div>
              <Badge className={`text-sm py-1 px-3 ${getStatusColor(systemStatus)}`}>
                {systemStatus}
                {systemStatus !== "Normal" && <AlertCircle className="ml-1 h-4 w-4" />}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#003344]">Temperatura</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-[#003344]">{systemData.temperature}°C</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-4">Rango: {config.temp.min}-{config.temp.max}°C</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#003344]">Humedad del Suelo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-[#003344]">{systemData.humidity}%</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-4">Rango: {config.humidity.min}-{config.humidity.max}%</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#003344]">Intensidad de Luz</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-[#003344]">{systemData.light} Lux</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-4">Rango: {config.light.min}-{config.light.max} Lux</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#003344]">Sistema de Riego</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-[#003344]">
                      {systemData.irrigationActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-4">
                    {config.irrigation.enabled ? "Sistema automático activado" : "Sistema automático desactivado"}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="overflow-hidden w-full">
              <CardHeader>
                <CardTitle>Tendencias Generales</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="temperature">
                  <TabsList className="mb-4">
                    <TabsTrigger value="temperature">Temperatura</TabsTrigger>
                    <TabsTrigger value="humidity">Humedad</TabsTrigger>
                    <TabsTrigger value="light">Luz</TabsTrigger>
                  </TabsList>
                  <TabsContent value="temperature">
                    <OverviewChart type="temperature" />
                  </TabsContent>
                  <TabsContent value="humidity">
                    <OverviewChart type="humidity" />
                  </TabsContent>
                  <TabsContent value="light">
                    <OverviewChart type="light" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
