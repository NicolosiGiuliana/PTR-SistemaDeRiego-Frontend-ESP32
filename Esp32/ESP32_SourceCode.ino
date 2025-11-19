#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// Configuración de la red WiFi
const char *ssid = "TUWIFI";
const char *password = "TUCONTRASEÑA";

// Configuración del servidor WebSocket
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

#define LDR_PIN 35  // Sensor de luz
#define SOIL_PIN 34 // Sensor de humedad

#define PUMP_PIN 2 // Pin del actuador de bomba de riego (simulado)
#define ILUM_PIN 32 // Pin del actuador de iluminación (simulado)

// Variables de umbrales
float humidity_min = 20, humidity_max = 60, humidity_critical = 10, humidity_auto = 50;
int ldr_min = 1000, ldr_max = 500, ldr_critical = 2500, ldr_auto = 1500;
float temp_min = 15, temp_max = 30, temp_critical = 5, temp_auto = 20;

bool irrigationStatus = false, iluminationStatus = false;
bool automaticMode = true, forcedIrrigation = false, forcedIlumination = false;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", -3 * 3600, 60000);

// Mapeo de humedad
int mapSoilToPercentage(int rawValue)
{
    return map(rawValue, 4095, 0, 0, 100);
}

// Notificación a clientes WebSocket
void notifyClients(String timestamp, int ldrValue, int soilPercentage, float tempValue)
{
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["timestamp"] = timestamp;
    jsonDoc["zona"] = "A1";
    jsonDoc["ldr"] = ldrValue;
    jsonDoc["humedad"] = soilPercentage;
    jsonDoc["temperatura"] = tempValue;
    jsonDoc["riegoActivo"] = irrigationStatus;
    jsonDoc["iluminacionActivo"] = iluminationStatus;
    jsonDoc["automaticoActivo"] = automaticMode;

    String jsonString;
    serializeJson(jsonDoc, jsonString);
    ws.textAll(jsonString);
}

// Manejo de mensajes WebSocket
void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{
    AwsFrameInfo *info = (AwsFrameInfo *)arg;
    if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT)
    {
        String message = String((char *)data);
        StaticJsonDocument<300> jsonDoc;
        if (!deserializeJson(jsonDoc, message))
        {

            if (jsonDoc.containsKey("AUTO_ON"))
                automaticMode = true;
            if (jsonDoc.containsKey("AUTO_OFF"))
                automaticMode = false;

            if (!automaticMode)
            {
                forcedIrrigation = jsonDoc.containsKey("RIEGO_ON") ? true : jsonDoc.containsKey("RIEGO_OFF") ? false
                                                                                                             : irrigationStatus;
                forcedIlumination = jsonDoc.containsKey("ILUM_ON") ? true : jsonDoc.containsKey("ILUM_OFF") ? false
                                                                                                            : iluminationStatus;
            }

            humidity_min = jsonDoc["humidity_min"] | humidity_min;
            humidity_max = jsonDoc["humidity_max"] | humidity_max;
            humidity_critical = jsonDoc["humidity_critical"] | humidity_critical;
            humidity_auto = jsonDoc["humidity_auto"] | humidity_auto;

            ldr_min = jsonDoc["ldr_min"] | ldr_min;
            ldr_max = jsonDoc["ldr_max"] | ldr_max;
            ldr_critical = jsonDoc["ldr_critical"] | ldr_critical;
            ldr_auto = jsonDoc["ldr_auto"] | ldr_auto;

            temp_min = jsonDoc["temp_min"] | temp_min;
            temp_max = jsonDoc["temp_max"] | temp_max;
            temp_critical = jsonDoc["temp_critical"] | temp_critical;
            temp_auto = jsonDoc["temp_auto"] | temp_auto;
        }
    }
}

// Manejo de eventos WebSocket
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len)
{
    if (type == WS_EVT_CONNECT)
    {
        Serial.printf("Cliente %u conectado\n", client->id());
    }
    else if (type == WS_EVT_DISCONNECT)
    {
        Serial.printf("Cliente %u desconectado\n", client->id());
    }
    else if (type == WS_EVT_DATA)
    {
        handleWebSocketMessage(arg, data, len);
    }
}

// Configuración del sistema
void setup()
{
    Serial.begin(115200);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Conectando a WiFi...");
    }

    pinMode(ILUM_PIN, OUTPUT);
    pinMode(PUMP_PIN, OUTPUT);

    Serial.println("Conectado a WiFi");
    Serial.print("Dirección IP: ");
    Serial.println(WiFi.localIP());

    timeClient.begin();
    ws.onEvent(onEvent);
    server.addHandler(&ws);
    server.begin();
}

// Control de riego e iluminación
void controlRiego(int soilPercentage, float ldr, float temp)
{
    if (automaticMode)
    {
        if (humidity_auto > soilPercentage && ldr_auto < ldr && temp_auto < temp)
        {
            irrigationStatus = true;
        }
        else
        {
            irrigationStatus = (soilPercentage < humidity_critical);
        }

        iluminationStatus = (ldr > ldr_critical);
    }
    else
    {
        irrigationStatus = forcedIrrigation;
        iluminationStatus = forcedIlumination;
    }

    digitalWrite(ILUM_PIN, iluminationStatus ? HIGH : LOW);
    digitalWrite(PUMP_PIN, irrigationStatus ? HIGH : LOW);

    Serial.printf("Riego: %s | Iluminación: %s\n", irrigationStatus ? "ACTIVADO" : "DESACTIVADO",
                  iluminationStatus ? "ACTIVADO" : "DESACTIVADO");
}

// Bucle principal
void loop()
{
    timeClient.update();
    int ldrValue = analogRead(LDR_PIN);
    int soilPercentage = mapSoilToPercentage(analogRead(SOIL_PIN));
    float tempValue = random(19, 26); // Simulación de temperatura

    controlRiego(soilPercentage, ldrValue, tempValue);
    notifyClients(timeClient.getFormattedTime(), ldrValue, soilPercentage, tempValue);

    delay(1000);
}