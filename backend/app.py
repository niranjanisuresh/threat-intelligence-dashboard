from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("ABUSEIPDB_API_KEY") or "your_abuseipdb_key_here"

@app.route("/")
def home():
    return "Threat Intelligence Backend Running"

@app.route("/check_ip", methods=["GET"])
def check_ip():
    ip = request.args.get("ip")
    headers = {
        "Key": API_KEY,
        "Accept": "application/json"
    }
    response = requests.get(
        f"https://api.abuseipdb.com/api/v2/check?ipAddress={ip}&maxAgeInDays=90",
        headers=headers
    )
    return response.json()

@app.route("/geolocate", methods=["GET"])
def geolocate():
    ip = request.args.get("ip")
    geo = requests.get(f"http://ip-api.com/json/{ip}")
    return jsonify(geo.json())

if __name__ == "__main__":
    app.run(debug=True)
