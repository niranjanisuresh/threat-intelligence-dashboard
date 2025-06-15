import React, { useState } from 'react';
import axios from 'axios';

import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = "https://threat-intelligence-dashboard.onrender.com/"; // <-- Replace with actual Render URL

const App = () => {
  const [ip, setIp] = useState('');
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/check_ip?ip=${ip}`);
      setData(response.data);
      filterThreats(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please check your API.");
    }
    setLoading(false);
  };

  const filterThreats = (data) => {
    if (data.threats) {
      const filtered = data.threats.filter(item => item.severity >= 7);
      setFilteredData(filtered);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Threat Intelligence Lookup</h2>
      <div className="input-group mb-3">
        <input 
          type="text" 
          className="form-control"
          placeholder="Enter IP Address" 
          value={ip} 
          onChange={(e) => setIp(e.target.value)} 
        />
        <button className="btn btn-primary" onClick={handleCheck}>Check</button>
      </div>

      {loading && <p className="text-center">Fetching data...</p>}
      {error && <p className="text-danger text-center">{error}</p>}
      
      {filteredData && (
        <div>
          <h4>High-Severity Threats</h4>
          <ul className="list-group">
            {filteredData.map((item, index) => (
              <li className="list-group-item" key={index}>
                <strong>{item.type}:</strong> {item.description} (Severity: {item.severity})
              </li>
            ))}
          </ul>
        </div>
      )}

      {data && (
        <div className="mt-4">
          <h5>Full API Response</h5>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
