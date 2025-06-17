import pandas as pd

def load_weather_data(file_path):
    df = pd.read_csv(file_path, parse_dates=['datetime_utc'])
    df['year'] = df['datetime_utc'].dt.year
    df['month'] = df['datetime_utc'].dt.month
    df.dropna(inplace=True)
    return df
