import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'

const API_URL =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000';

function App() {
  const [ip, setIp] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // ← Include your fetch/axios call in this async handler
  const handleCheck = async () => {
    if (!ip.trim()) {
      return setError("Please enter an IP address");
    }
    setError("");
    try {
      // axios example
      const res = await axios.get(`${API_URL}/check_ip`, {
        params: { ip },
      });
      setData(res.data);

      // OR fetch example
      // const response = await fetch(`${API_URL}/check_ip?ip=${ip}`);
      // const json = await response.json();
      // setData(json);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch threat data");
    }
  };

  return (
    <div>
      <input
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="Enter IP (e.g. 8.8.8.8)"
      />
      <button onClick={handleCheck}>Check</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default App;
