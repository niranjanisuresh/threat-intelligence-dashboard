from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app, origins=["https://threat-intelligence-dashboard.vercel.app"])

ABUSEIPDB_API_KEY = os.getenv("ABUSEIPDB_API_KEY")

@app.route("/")
def home():
    return "Threat Intelligence API is live!"

@app.route("/check_ip", methods=["GET"])
def check_ip():
    ip = request.args.get("ip")
    if not ip:
        return jsonify({"error": "IP address is required"}), 400

    try:
        response = requests.get(
            "https://api.abuseipdb.com/api/v2/check",
            headers={
                "Key": ABUSEIPDB_API_KEY,
                "Accept": "application/json"
            },
            params={
                "ipAddress": ip,
                "maxAgeInDays": 90
            }
        )
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
