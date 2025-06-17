import sqlite3

def create_connection(db_path="weather.db"):
    return sqlite3.connect(db_path)

def insert_weather_data(df, conn):
    df.to_sql("weather", conn, if_exists="replace", index=False)
