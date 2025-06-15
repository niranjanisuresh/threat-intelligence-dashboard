import os
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_KEY = os.environ.get("ABUSEIPDB_API_KEY")
ABUSEIPDB_ENDPOINT = "https://api.abuseipdb.com/api/v2/check"

@app.route("/")
def home():
    return "Threat Intelligence API is online."

@app.route("/check_ip")
def check_ip():
    ip = request.args.get("ip")
    if not ip:
        return jsonify({"error": "Missing 'ip' parameter"}), 400

    headers = {
        "Key": API_KEY,
        "Accept": "application/json"
    }
    params = {
        "ipAddress": ip,
        "maxAgeInDays": 90
    }

    try:
        response = requests.get(ABUSEIPDB_ENDPOINT, headers=headers, params=params)
        data = response.json()
        abuse_score = data["data"]["abuseConfidenceScore"]

        # Customize response based on threat level
        if abuse_score >= 70:
            threat_level = "High"
        elif abuse_score >= 30:
            threat_level = "Medium"
        else:
            threat_level = "Low"

        return jsonify({
            "ip": ip,
            "threat_level": threat_level,
            "abuse_score": abuse_score,
            "message": "Scan successful."
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
