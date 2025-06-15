import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function App() {
  const [inputIP, setInputIP] = useState("");
  const [result, setResult] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState("");

   "const BACKEND_URL = "https://your-backend.onrender.com";
   fetch(`${BACKEND_URL}/check_ip?ip=${ip}`);



  const getThreatLevel = (score) => {
    if (score >= 80) return "High";
    if (score >= 30) return "Medium";
    return "Low";
  };

  const getThreatColor = (score) => {
    if (score >= 80) return "#ff4d4d";
    if (score >= 30) return "#ffa500";
    return "#4caf50";
  };

  const handleCheck = async () => {
    if (!inputIP.trim()) {
      setError("Please enter an IP address.");
      return;
    }

    setError("");
    setResult(null);
    setGeoData(null);

    try {
      const [threatRes, geoRes] = await Promise.all([
        axios.get(`${API_URL}/check_ip`, { params: { ip: inputIP } }),
        axios.get(`${API_URL}/geolocate`, { params: { ip: inputIP } })
      ]);

      if (threatRes.data?.data) {
        setResult(threatRes.data.data);
      }
      setGeoData(geoRes.data);
    } catch (err) {
      console.error("Geolocation Error:", err.response || err.message || err);
      setError("Error fetching data. Please check the IP and try again.");
    }
  };

  return (
    <div className="container">
      <h1>🛡️ Threat Intelligence Dashboard</h1>

      <input
        type="text"
        placeholder="Enter IP address"
        value={inputIP}
        onChange={(e) => setInputIP(e.target.value)}
      />
      <button onClick={handleCheck}>Check</button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h3>IP Reputation Result</h3>
          <p><strong>IP:</strong> {result.ipAddress}</p>
          <p><strong>Domain:</strong> {result.domain || "N/A"}</p>
          <p><strong>ISP:</strong> {geoData?.isp || "N/A"}</p>
          <p>
            <strong>Country:</strong> {geoData?.country}
            {geoData?.countryCode && (
              <img
                src={`https://flagcdn.com/24x18/${geoData.countryCode.toLowerCase()}.png`}
                alt="flag"
                style={{ marginLeft: "8px", verticalAlign: "middle" }}
              />
            )}
          </p>
          <p>
            <strong>Abuse Score:</strong>{" "}
            <span
              style={{
                color: getThreatColor(result.abuseConfidenceScore),
                fontWeight: "bold"
              }}
            >
              {result.abuseConfidenceScore} ({getThreatLevel(result.abuseConfidenceScore)})
            </span>
          </p>

          {geoData?.lat && geoData?.lon && (
            <MapContainer
              center={[geoData.lat, geoData.lon]}
              zoom={5}
              scrollWheelZoom={false}
              style={{ height: "300px", marginTop: "20px", borderRadius: "10px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[geoData.lat, geoData.lon]}
                icon={L.icon({
                  iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
                  iconSize: [30, 30]
                })}
              >
                <Popup>
                  IP: {inputIP}
                  <br />
                  Country: {geoData?.country}
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
