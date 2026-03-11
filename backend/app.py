from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import run_agent

app = Flask(__name__)

# Allow all origins for local development
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def home():
    return {
        "message": "FireReach API is running",
        "endpoint": "/run-agent"
    }


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "service": "FireReach API"})


@app.route("/run-agent", methods=["POST"])
def run():
    """Main agent endpoint — accepts ICP, company, email and returns signals, research, email."""
    try:
        data = request.get_json(force=True)

        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        icp = data.get("icp", "").strip()
        company = data.get("company", "").strip()
        email = data.get("email", "").strip()

        # Validate required fields
        if not icp:
            return jsonify({"error": "ICP is required"}), 400
        if not company:
            return jsonify({"error": "Company name is required"}), 400
        if not email:
            return jsonify({"error": "Email is required"}), 400

        print(f"\nIncoming Request → company={company}, email={email}")

        result = run_agent(icp, company, email)

        return jsonify(result)

    except Exception as e:
        print(f"Agent error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🔥 FireReach API starting on http://127.0.0.1:5001")
    app.run(port=5001, debug=True)