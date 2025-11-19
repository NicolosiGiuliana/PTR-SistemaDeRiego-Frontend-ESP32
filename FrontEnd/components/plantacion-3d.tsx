"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Droplets, Lightbulb } from "lucide-react"

interface Plantacion3DProps {
  plantacion: {
    id: string
    nombre: string
    tipo: "simulada" | "real"
    datos: {
      humedad: number
      luz: number
      riegoActivo: boolean
      luzActiva: boolean
      timestamp: string
    }
  }
  onUpdate: (datos: {
    humedad: number
    luz: number
    riegoActivo: boolean
    luzActiva: boolean
    timestamp: string
  }) => void
}

export function Plantacion3D({ plantacion, onUpdate }: Plantacion3DProps) {
  const wsRef = useRef<WebSocket | null>(null)

  function estimateLuxFromADC(adcValue: number) {
    const adcMax = 4000
    const vIn = 3.3
    const rFixed = 10000

    const voltage = (adcValue / adcMax) * vIn
    const rLDR = rFixed * (voltage / (vIn - voltage))
    const lux = 500 * Math.pow((10000 / rLDR), 1.4)
    return Math.round(lux)
  }

  const completarFecha = (hora: string) => {
    const hoy = new Date().toISOString().split("T")[0]
    return new Date(`${hoy}T${hora}`)
  }

  useEffect(() => {
    if (plantacion.tipo === "real") {
      wsRef.current = new WebSocket("wss://desktop-5ldkqva.taila9e2ab.ts.net/ws")

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onUpdate({
            humedad: data.humedad,
            luz: estimateLuxFromADC(data.ldr),
            riegoActivo: data.riegoActivo,
            luzActiva: plantacion.datos.luzActiva,
            timestamp: data.timestamp
          })
        } catch (error) {
          console.error("Error al procesar datos del WebSocket:", error)
        }
      }

      wsRef.current.onerror = (error) => {
        console.error("Error en la conexión WebSocket:", error)
      }

      return () => {
        if (wsRef.current) wsRef.current.close()
      }
    } else {
      const interval = setInterval(() => {
        onUpdate({
          humedad: Math.random() * 100,
          luz: Math.random() * 3000,
          riegoActivo: plantacion.datos.riegoActivo,
          luzActiva: plantacion.datos.luzActiva,
          timestamp: new Date().toISOString()
        })
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [plantacion.tipo, plantacion.datos.riegoActivo, plantacion.datos.luzActiva])

  const handleRiegoChange = (checked: boolean) => {
    if (plantacion.tipo === "real") {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            [checked ? "RIEGO_ON" : "RIEGO_OFF"]: true,
            AUTO_OFF: true
          })
        )
      } else {
        console.warn("WebSocket no está conectado")
      }
    }

    onUpdate({
      ...plantacion.datos,
      riegoActivo: checked,
      timestamp: new Date().toISOString()
    })
  }

  const handleIluminacionChange = (checked: boolean) => {
    if (plantacion.tipo === "real") {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            [checked ? "ILUM_ON" : "ILUM_OFF"]: true,
            AUTO_OFF: true
          })
        )
      } else {
        console.warn("WebSocket no está conectado")
      }
    }

    onUpdate({
      ...plantacion.datos,
      luzActiva: checked,
      timestamp: new Date().toISOString()
    })
  }


  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{plantacion.nombre}</CardTitle>
          <Badge variant={plantacion.tipo === "real" ? "default" : "secondary"}>
            {plantacion.tipo === "real" ? "Real" : "Simulada"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Humedad del Suelo</span>
              <span className="text-sm text-muted-foreground">
                {plantacion.datos.humedad.toFixed(1)}%
              </span>
            </div>
            <Progress value={plantacion.datos.humedad} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Nivel de Luz</span>
              <span className="text-sm text-muted-foreground">
                {plantacion.datos.luz.toFixed(0)} lux
              </span>
            </div>
            <Progress value={Math.min((plantacion.datos.luz / 1000) * 100, 100)} />
          </div>

          <div className="flex items-center gap-4">
            <Droplets className="h-5 w-5 text-blue-500" />
            <Label htmlFor="irrigation-control" className="flex-1">
              Sistema de Riego
            </Label>
            <Switch
              id="irrigation-control"
              checked={plantacion.datos.riegoActivo}
              onCheckedChange={handleRiegoChange}
            />
          </div>

          <div className="flex items-center gap-4">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <Label htmlFor="iluminacion-control" className="flex-1">
              Sistema de Iluminación
            </Label>
            <Switch
              id="iluminacion-control"
              checked={plantacion.datos.luzActiva}
              onCheckedChange={handleIluminacionChange}
            />
          </div>

          <div className="text-xs text-muted-foreground">
            Última actualización:{" "}
            {(plantacion.tipo === "real"
              ? completarFecha(plantacion.datos.timestamp)
              : new Date(plantacion.datos.timestamp)
            ).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
