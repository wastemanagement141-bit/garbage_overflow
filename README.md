# Smart Waste Management System

A complete IoT-enabled Garbage Overflow Management System.

## Architecture
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js (Vercel Serverless Functions)
- **Database**: Supabase (PostgreSQL)
- **IoT**: ESP32 Integration

## Setup Instructions

### 1. Database (Supabase)
1. Create a new Supabase project.
2. Go to the SQL Editor and run the contents of `supabase_schema.sql`.
3. Go to **Project Settings > API** and copy:
   - Project URL
   - `anon` public key

### 2. Environment Variables
Create a `.env` file in the root directory with your keys:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
To run the full stack (Frontend + Backend Functions), you need the Vercel CLI:
```bash
npm i -g vercel
vercel dev
```

If you only want to run the frontend design (API calls will fail):
```bash
npm run dev
```

### 5. Deploy to Vercel
1. Push this code to GitHub.
2. Import project in Vercel.
3. Add the Environment Variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) in Vercel Dashboard.
4. Deploy!

## API Endpoints

- `POST /api/bin/update`: Receives data from ESP32.
  - Body: `{ "deviceId": "BIN001", "fillPercentage": 85 }`
- `GET /api/bin/status`: Returns current status.
- `GET /api/bin/history`: Returns last 20 records.

## ESP32 Reference Code (C++ / Arduino)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "https://your-project.vercel.app/api/bin/update";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Simulate sensor data
    int fill = random(0, 100); 
    String payload = "{\"deviceId\": \"BIN001\", \"fillPercentage\": " + String(fill) + "}";
    
    int httpResponseCode = http.POST(payload);
    Serial.print("HTTP Code: ");
    Serial.println(httpResponseCode);
    
    http.end();
  }
  delay(5000);
}
```
