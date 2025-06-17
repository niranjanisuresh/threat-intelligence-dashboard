from app.utils.data_loader import load_weather_data

df = load_weather_data("data/testset.csv")
print(df.head())
