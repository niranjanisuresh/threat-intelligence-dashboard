from fastapi import FastAPI, Query
from typing import Optional
import sqlite3
import pandas as pd

app = FastAPI()

@app.get("/weather")
def get_weather(year: Optional[int] = Query(None), month: Optional[int] = Query(None)):
    conn = sqlite3.connect("weather.db")
    query = "SELECT * FROM weather"
    conditions = []

    if year:
        conditions.append(f"year = {year}")
    if month:
        conditions.append(f"month = {month}")

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    df = pd.read_sql_query(query, conn)
    return df.to_dict(orient="records")
@app.get("/weather/summary")
def get_summary():
    conn = sqlite3.connect("weather.db")
    df = pd.read_sql_query("SELECT * FROM weather", conn)

    summary = {
        "rows": len(df),
        "date_range": f"{df['datetime_utc'].min()} → {df['datetime_utc'].max()}",
        "avg_temp": round(df['_tempm'].mean(), 2),
        "avg_humidity": round(df['_hum'].mean(), 2),
        "total_precipitation": round(df['_precipm'].sum(), 2),
    }

    return summary
