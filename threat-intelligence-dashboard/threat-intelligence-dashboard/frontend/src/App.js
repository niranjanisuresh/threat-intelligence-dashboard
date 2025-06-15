import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [ip, setIp] = useState('');
  const [data, setData] = useState(null);

  const handleCheck = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/check_ip?ip=${ip}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h2>Threat Intelligence Lookup</h2>
      <input 
        type="text" 
        placeholder="Enter IP Address" 
        value={ip} 
        onChange={(e) => setIp(e.target.value)} 
      />
      <button onClick={handleCheck}>Check</button>

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default App;
