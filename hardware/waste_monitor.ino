#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "project";
const char* password = "123456700";

// REPLACE THIS WITH YOUR DEPLOYED VERCEL URL
// Example: https://your-project-name.vercel.app/api/bin/update
const char* serverName = "https://garbageoverflow.vercel.app/api/bin/update";

#define TRIG 5
#define ECHO 18

float binHeight = 30.0; // Total height of the dustbin in cm
float lastSentValue = -1;
unsigned long lastSendTime = 0;
const int sendInterval = 2000; // Minimum time between sends (ms)

void setup() {
  Serial.begin(115200);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void reconnectWiFi() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Reconnecting to WiFi...");
    WiFi.disconnect();
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("\nReconnected.");
  }
}

void loop() {
  reconnectWiFi();

  long duration;
  float distance;
  int levelPercent;

  // Trigger ultrasonic sensor
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  duration = pulseIn(ECHO, HIGH, 30000); // 30ms timeout

  if (duration == 0) {
    Serial.println("Sensor timeout - Check wiring!");
    delay(1000);
    return;
  }

  // Calculate distance in cm
  distance = duration * 0.034 / 2;

  // Handle constraints
  if (distance > binHeight) distance = binHeight;
  if (distance < 0) distance = 0;

  // Calculate fill percentage
  // 0cm distance = 100% full
  // 30cm distance = 0% full
  levelPercent = (int)(((binHeight - distance) / binHeight) * 100);

  // Bounds checking
  if (levelPercent < 0) levelPercent = 0;
  if (levelPercent > 100) levelPercent = 100;

  Serial.print("Dist: ");
  Serial.print(distance);
  Serial.print(" cm | Level: ");
  Serial.print(levelPercent);
  Serial.println("%");

  // Send update if level changes by 2% or more, and enough time has passed
  if (abs(levelPercent - lastSentValue) >= 2 || (millis() - lastSendTime > 10000)) { // Send heartbeats every 10s even if no change
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      
      Serial.println("Sending data to server...");
      http.begin(serverName); 
      http.addHeader("Content-Type", "application/json");

      // JSON payload
      // Backend expects camelCase "deviceId" which it maps internally
      String jsonPayload = "{\"deviceId\": \"BIN001\", \"fillPercentage\": " + String(levelPercent) + "}";

      int httpResponseCode = http.POST(jsonPayload);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        Serial.println("Response: " + response);
        lastSentValue = levelPercent;
        lastSendTime = millis();
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    }
  }

  delay(1000); 
}
