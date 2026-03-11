from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import run_agent

app = Flask(__name__)

CORS(app)


@app.route("/run-agent", methods=["POST"])
def run():

    data = request.json

    icp = data["icp"]
    company = data["company"]
    email = data["email"]

    result = run_agent(icp, company, email)

    return jsonify(result)


if __name__ == "__main__":

    app.run(port=5000, debug=True)