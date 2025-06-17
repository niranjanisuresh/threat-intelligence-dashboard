from app.utils.data_loader import load_weather_data
from app.db.database import create_connection, insert_weather_data

df = load_weather_data("data/testset.csv")
conn = create_connection()
insert_weather_data(df, conn)
print("✅ Data loaded into database!")
