from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import run_agent
from services.hunter_service import search_employees_by_company
from services.llm_service import generate_json
from services.email_service import send_email
import json

app = Flask(__name__)

# Allow all origins for local development
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "service": "FireReach API"})

@app.route("/find-companies", methods=["POST"])
def find_companies():
    data = request.get_json(force=True)
    icp = data.get("icp", "").strip()
    
    if not icp:
        return jsonify({"error": "ICP is required"}), 400
        
    prompt = f"""
    You are a GTM data expert. Given the following Ideal Customer Profile (ICP), identify 5 real-world companies that perfectly fit this description.
    
    ICP:
    {icp}
    
    Return a strictly structured JSON object with a single key "companies", which is an array of objects. 
    Each object must have "name" (the company name) and "domain" (the company website domain, e.g. stripe.com).
    Your response must only be valid JSON.
    """
    
    try:
        response_text = generate_json(prompt)
        companies_data = json.loads(response_text)
        return jsonify(companies_data)
    except Exception as e:
        print(f"Error finding companies: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/get-employees", methods=["GET"])
def get_employees():
    company = request.args.get("company")
    if not company:
        return jsonify({"error": "Company name is required"}), 400
        
    try:
        employees = search_employees_by_company(company)
        return jsonify({"employees": employees})
    except Exception as e:
        print(f"Error fetching employees: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/send-draft", methods=["POST"])
def send_draft():
    data = request.get_json(force=True)
    to_email = data.get("to")
    subject = data.get("subject", "FireReach Outreach")
    body = data.get("body")
    
    if not to_email or not body:
        return jsonify({"error": "Missing 'to' or 'body'"}), 400
        
    try:
        success = send_email(to_email, subject, body)
        if success is False:
             return jsonify({"error": "Failed due to unverified domain"}), 400
        return jsonify({"message": "Sent successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
        employee_name = data.get("employee_name", "").strip()
        employee_role = data.get("employee_role", "").strip()
        employee_dept = data.get("employee_dept", "").strip()

        # Validate required fields
        if not icp:
            return jsonify({"error": "ICP is required"}), 400
        if not company:
            return jsonify({"error": "Company name is required"}), 400
        if not email:
            return jsonify({"error": "Email is required"}), 400

        print(f"\nIncoming Request → company={company}, email={email}, employee={employee_name}")

        result = run_agent(icp, company, email, employee_name, employee_role, employee_dept)

        return jsonify(result)

    except Exception as e:
        print(f"Agent error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🔥 FireReach API starting on http://127.0.0.1:5000")
    app.run(port=5000, debug=True)