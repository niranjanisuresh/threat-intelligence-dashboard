import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Optional: basic styling

function App() {
  const [inputIP, setInputIP] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const API_URL = "https://threat-intelligence-dashboard01.onrender.com";

  const handleCheck = async () => {
    setResult(null);
    setError("");

    if (!inputIP) {
      setError("Please enter an IP address.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/check_ip`, {
        params: { ip: inputIP },
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data from backend. Check console logs or CORS settings.");
    }
  };

  return (
    <div className="container">
      <h1>🛡️ Threat Intelligence Dashboard</h1>

      <input
        type="text"
        placeholder="Enter IP address (e.g., 8.8.8.8)"
        value={inputIP}
        onChange={(e) => setInputIP(e.target.value)}
      />
      <button onClick={handleCheck}>Check</button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h3>Lookup Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
