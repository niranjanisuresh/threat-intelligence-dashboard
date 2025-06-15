from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Threat Intelligence API is live!"

@app.route('/check_ip')
def check_ip():
    ip = request.args.get('ip')
    if not ip:
        return jsonify({"error": "No IP provided"}), 400
    return jsonify({
        "ip": ip,
        "threat_level": "Low",  # Replace with real threat data
        "message": "No known issues with this IP."
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
