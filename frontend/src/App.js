import React, { useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

function App() {
  const [ip, setIp] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheck = async () => {
    // …your async fetch/axios logic here…
  }

  return (
    <div className="container mt-5">
      {/* 1) Your input field */}
      <input
        type="text"
        value={ip}
        onChange={e => setIp(e.target.value)}
        placeholder="Enter IP (e.g. 8.8.8.8)"
        className="form-control mb-3"
        style={{ maxWidth: '300px' }}
      />
      <button onClick={handleCheck} disabled={loading}>
  {loading ? 'Checking…' : 'Check'}
</button>


      {/* 2) ← Include the button right here, inside the return’s JSX */}
      <button
        className="btn btn-primary"
        onClick={handleCheck}      {/* ← this wires the click to your function */}
        disabled={loading}
      >
        {loading ? 'Checking…' : 'Check'}
      </button>

      {/* 3) Your error & data display */}
      {error && <p className="text-danger mt-3">{error}</p>}
      {data && <pre className="mt-3">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}

export default App;
