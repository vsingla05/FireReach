import requests
from config import HUNTER_API_KEY

def search_employees_by_company(company_name):
    if not HUNTER_API_KEY:
        # Mock data if no API key is provided
        return [
            {"email": "ceo@example.com", "first_name": "Jane", "last_name": "Doe", "position": "CEO", "department": "executive"},
            {"email": "cto@example.com", "first_name": "John", "last_name": "Smith", "position": "CTO", "department": "engineering"},
            {"email": "vp.sales@example.com", "first_name": "Alice", "last_name": "Johnson", "position": "VP Sales", "department": "sales"}
        ]

    url = "https://api.hunter.io/v2/domain-search"
    params = {
        "company": company_name,
        "api_key": HUNTER_API_KEY,
        "limit": 10
    }
    
    try:
        res = requests.get(url, params=params)
        data = res.json()
        
        if "data" in data and "emails" in data["data"]:
            emails = data["data"]["emails"]
            # Normalize to ensure 'email' key exists (Hunter uses 'value')
            for emp in emails:
                if "value" in emp and "email" not in emp:
                    emp["email"] = emp["value"]
            return emails
        return []
    except Exception as e:
        print(f"Hunter API error: {e}")
        return []
