"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"

export function ConfiguracionPage() {
  // Configuración de temperatura
  const [tempMin, setTempMin] = useState(17)
  const [tempMax, setTempMax] = useState(28)
  const [tempCritical, setTempCritical] = useState(30)

  // Configuración de humedad
  const [humidityMin, setHumidityMin] = useState(45)
  const [humidityMax, setHumidityMax] = useState(75)
  const [humidityCritical, setHumidityCritical] = useState(30)

  // Configuración de luz
  const [lightMin, setLightMin] = useState(350)
  const [lightMax, setLightMax] = useState(750)
  const [lightCritical, setLightCritical] = useState(2000)

  // Configuración de riego
  const [irrigationEnabled, setIrrigationEnabled] = useState(true)
  const [irrigationHumidityThreshold, setIrrigationHumidityThreshold] = useState(50)
  const [irrigationTempThreshold, setIrrigationTempThreshold] = useState(25)
  const [irrigationLightThreshold, setIrrigationLightThreshold] = useState(1500)

  // Configuración de notificaciones
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [notificationEmail, setNotificationEmail] = useState("admin@ejemplo.com")
  const [notificationPhone, setNotificationPhone] = useState("+34600000000")

  useEffect(() => {
    // Cargar configuración de temperatura
    const tempConfig = JSON.parse(localStorage.getItem("tempConfig") || "{}");
    if (tempConfig.tempMin) setTempMin(tempConfig.tempMin);
    if (tempConfig.tempMax) setTempMax(tempConfig.tempMax);
    if (tempConfig.tempCritical) setTempCritical(tempConfig.tempCritical);

    // Cargar configuración de humedad
    const humidityConfig = JSON.parse(localStorage.getItem("humidityConfig") || "{}");
    if (humidityConfig.humidityMin) setHumidityMin(humidityConfig.humidityMin);
    if (humidityConfig.humidityMax) setHumidityMax(humidityConfig.humidityMax);
    if (humidityConfig.humidityCritical) setHumidityCritical(humidityConfig.humidityCritical);

    // Cargar configuración de luz
    const lightConfig = JSON.parse(localStorage.getItem("lightConfig") || "{}");
    if (lightConfig.lightMin) setLightMin(lightConfig.lightMin);
    if (lightConfig.lightMax) setLightMax(lightConfig.lightMax);
    if (lightConfig.lightCritical) setLightCritical(lightConfig.lightCritical);

    // Cargar configuración de riego
    const irrigationConfig = JSON.parse(localStorage.getItem("irrigationConfig") || "{}");
    if (irrigationConfig.irrigationEnabled !== undefined) setIrrigationEnabled(irrigationConfig.irrigationEnabled);
    if (irrigationConfig.irrigationHumidityThreshold) setIrrigationHumidityThreshold(irrigationConfig.irrigationHumidityThreshold);
    if (irrigationConfig.irrigationTempThreshold) setIrrigationTempThreshold(irrigationConfig.irrigationTempThreshold);
    if (irrigationConfig.irrigationLightThreshold) setIrrigationLightThreshold(irrigationConfig.irrigationLightThreshold);

    // Cargar configuración de notificaciones
    const notificationConfig = JSON.parse(localStorage.getItem("notificationConfig") || "{}");
    if (notificationConfig.notificationsEnabled !== undefined) setNotificationsEnabled(notificationConfig.notificationsEnabled);
    if (notificationConfig.emailNotifications !== undefined) setEmailNotifications(notificationConfig.emailNotifications);
    if (notificationConfig.smsNotifications !== undefined) setSmsNotifications(notificationConfig.smsNotifications);
    if (notificationConfig.notificationEmail) setNotificationEmail(notificationConfig.notificationEmail);
    if (notificationConfig.notificationPhone) setNotificationPhone(notificationConfig.notificationPhone);
  }, []);

  const handleSaveConfig = (section: string) => {
    switch (section) {
      case "temperatura":
        localStorage.setItem("tempConfig", JSON.stringify({
          tempMin,
          tempMax,
          tempCritical
        }));
        break;
      case "humedad":
        localStorage.setItem("humidityConfig", JSON.stringify({
          humidityMin,
          humidityMax,
          humidityCritical
        }));
        break;
      case "luz":
        localStorage.setItem("lightConfig", JSON.stringify({
          lightMin,
          lightMax,
          lightCritical
        }));
        break;
      case "sistema de riego":
        localStorage.setItem("irrigationConfig", JSON.stringify({
          irrigationEnabled,
          irrigationHumidityThreshold,
          irrigationTempThreshold,
          irrigationLightThreshold
        }));
        break;
      case "notificaciones":
        localStorage.setItem("notificationConfig", JSON.stringify({
          notificationsEnabled,
          emailNotifications,
          smsNotifications,
          notificationEmail,
          notificationPhone
        }));
        break;
    }

    toast({
      title: "Configuración guardada",
      description: `La configuración de ${section} ha sido actualizada correctamente.`,
      action: <ToastAction altText="Ok">Ok</ToastAction>,
    })
  }

  return (
    <div className="flex min-h-screen bg-[#87CEEB] overflow-hidden">
      <div className="flex-1 p-6 md:p-8 bg-white m-4 rounded-3xl overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#003344]">Configuración</h1>
            <p className="text-slate-500">Ajusta los parámetros del sistema de monitoreo</p>
          </div>

          <Tabs defaultValue="thresholds">
            <TabsList className="mb-4">
              <TabsTrigger value="thresholds">Umbrales</TabsTrigger>
              <TabsTrigger value="irrigation">Sistema de Riego</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="thresholds">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Temperatura</CardTitle>
                    <CardDescription>Configura los umbrales de temperatura</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="temp-min">Mínimo (°C)</Label>
                        <span>{tempMin}°C</span>
                      </div>
                      <Slider
                        id="temp-min"
                        min={0}
                        max={40}
                        step={1}
                        value={[tempMin]}
                        onValueChange={(value) => setTempMin(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="temp-max">Máximo (°C)</Label>
                        <span>{tempMax}°C</span>
                      </div>
                      <Slider
                        id="temp-max"
                        min={0}
                        max={40}
                        step={1}
                        value={[tempMax]}
                        onValueChange={(value) => setTempMax(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="temp-critical">Crítico (°C)</Label>
                        <span>{tempCritical}°C</span>
                      </div>
                      <Slider
                        id="temp-critical"
                        min={0}
                        max={40}
                        step={1}
                        value={[tempCritical]}
                        onValueChange={(value) => setTempCritical(value[0])}
                      />
                    </div>

                    <Button
                      className="w-full bg-[#003344] hover:bg-[#004455]"
                      onClick={() => handleSaveConfig("temperatura")}
                    >
                      Guardar
                    </Button>
                  </CardContent>
                </Card>

                {/* Configuración de humedad */}
                <Card>
                  <CardHeader>
                    <CardTitle>Humedad</CardTitle>
                    <CardDescription>Configura los umbrales de humedad</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="humidity-min">Mínimo (%)</Label>
                        <span>{humidityMin}%</span>
                      </div>
                      <Slider
                        id="humidity-min"
                        min={0}
                        max={100}
                        step={1}
                        value={[humidityMin]}
                        onValueChange={(value) => setHumidityMin(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="humidity-max">Máximo (%)</Label>
                        <span>{humidityMax}%</span>
                      </div>
                      <Slider
                        id="humidity-max"
                        min={0}
                        max={100}
                        step={1}
                        value={[humidityMax]}
                        onValueChange={(value) => setHumidityMax(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="humidity-critical">Crítico (%)</Label>
                        <span>{humidityCritical}%</span>
                      </div>
                      <Slider
                        id="humidity-critical"
                        min={0}
                        max={100}
                        step={1}
                        value={[humidityCritical]}
                        onValueChange={(value) => setHumidityCritical(value[0])}
                      />
                    </div>

                    <Button
                      className="w-full bg-[#003344] hover:bg-[#004455]"
                      onClick={() => handleSaveConfig("humedad")}
                    >
                      Guardar
                    </Button>
                  </CardContent>
                </Card>

                {/* Configuración de luz */}
                <Card>
                  <CardHeader>
                    <CardTitle>Intensidad de Luz</CardTitle>
                    <CardDescription>Configura los umbrales de luz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="light-min">Mínimo (Lux)</Label>
                        <span>{lightMin} Lux</span>
                      </div>
                      <Slider
                        id="light-min"
                        min={0}
                        max={3000}
                        step={50}
                        value={[lightMin]}
                        onValueChange={(value) => setLightMin(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="light-max">Máximo (Lux)</Label>
                        <span>{lightMax} Lux</span>
                      </div>
                      <Slider
                        id="light-max"
                        min={0}
                        max={3000}
                        step={50}
                        value={[lightMax]}
                        onValueChange={(value) => setLightMax(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="light-critical">Crítico (Lux)</Label>
                        <span>{lightCritical} Lux</span>
                      </div>
                      <Slider
                        id="light-critical"
                        min={0}
                        max={3000}
                        step={50}
                        value={[lightCritical]}
                        onValueChange={(value) => setLightCritical(value[0])}
                      />
                    </div>

                    <Button className="w-full bg-[#003344] hover:bg-[#004455]" onClick={() => handleSaveConfig("luz")}>
                      Guardar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="irrigation">
              <Card>
                <CardHeader>
                  <CardTitle>Sistema de Riego</CardTitle>
                  <CardDescription>Configura los parámetros del sistema de riego automático</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="irrigation-enabled" className="text-base">
                        Sistema de riego automático
                      </Label>
                      <p className="text-sm text-slate-500">Activa o desactiva el sistema de riego automático</p>
                    </div>
                    <Switch
                      id="irrigation-enabled"
                      checked={irrigationEnabled}
                      onCheckedChange={setIrrigationEnabled}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Condiciones para activar el riego</h3>
                    <p className="text-sm text-slate-500">
                      El sistema activará el riego cuando se cumplan todas estas condiciones:
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="irrigation-humidity">Humedad por debajo de (%)</Label>
                        <span>{irrigationHumidityThreshold}%</span>
                      </div>
                      <Slider
                        id="irrigation-humidity"
                        min={0}
                        max={100}
                        step={1}
                        disabled={!irrigationEnabled}
                        value={[irrigationHumidityThreshold]}
                        onValueChange={(value) => setIrrigationHumidityThreshold(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="irrigation-temp">Temperatura por encima de (°C)</Label>
                        <span>{irrigationTempThreshold}°C</span>
                      </div>
                      <Slider
                        id="irrigation-temp"
                        min={0}
                        max={40}
                        step={1}
                        disabled={!irrigationEnabled}
                        value={[irrigationTempThreshold]}
                        onValueChange={(value) => setIrrigationTempThreshold(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="irrigation-light">Luz por debajo de (Lux)</Label>
                        <span>{irrigationLightThreshold} Lux</span>
                      </div>
                      <Slider
                        id="irrigation-light"
                        min={0}
                        max={3000}
                        step={50}
                        disabled={!irrigationEnabled}
                        value={[irrigationLightThreshold]}
                        onValueChange={(value) => setIrrigationLightThreshold(value[0])}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#003344] hover:bg-[#004455]"
                    onClick={() => handleSaveConfig("sistema de riego")}
                  >
                    Guardar
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>Configura las notificaciones del sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications-enabled" className="text-base">
                        Notificaciones
                      </Label>
                      <p className="text-sm text-slate-500">Activa o desactiva las notificaciones del sistema</p>
                    </div>
                    <Switch
                      id="notifications-enabled"
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Canales de notificación</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="text-base">
                          Correo electrónico
                        </Label>
                        <p className="text-sm text-slate-500">Recibe notificaciones por correo electrónico</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        disabled={!notificationsEnabled}
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    {emailNotifications && notificationsEnabled && (
                      <div className="space-y-2">
                        <Label htmlFor="notification-email">Correo electrónico</Label>
                        <Input
                          id="notification-email"
                          type="email"
                          value={notificationEmail}
                          onChange={(e) => setNotificationEmail(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications" className="text-base">
                          SMS
                        </Label>
                        <p className="text-sm text-slate-500">Recibe notificaciones por SMS</p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        disabled={!notificationsEnabled}
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>

                    {smsNotifications && notificationsEnabled && (
                      <div className="space-y-2">
                        <Label htmlFor="notification-phone">Número de teléfono</Label>
                        <Input
                          id="notification-phone"
                          type="tel"
                          value={notificationPhone}
                          onChange={(e) => setNotificationPhone(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full bg-[#003344] hover:bg-[#004455]"
                    onClick={() => handleSaveConfig("notificaciones")}
                  >
                    Guardar
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
