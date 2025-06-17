import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const DataPreview = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("/testset.csv")
      .then((res) => res.text())
      .then((data) => {
        const result = Papa.parse(data, { header: true });
        setRows(result.data);
      });
  }, []);

  return (
    <div className="card">
      <h2>📄 Preview: testset.csv</h2>
      {rows.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.keys(rows[0]).map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 5).map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading CSV...</p>
      )}
    </div>
  );
};

export default DataPreview;
