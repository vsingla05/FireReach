import requests
from config import SERPER_API_KEY

headers = {
    "X-API-KEY": SERPER_API_KEY,
    "Content-Type": "application/json"
}

def serper_news(query):
    url = "https://google.serper.dev/news"
    payload = {
        "q": query,
        "num": 5
    }
    
    try:
        res = requests.post(url, headers=headers, json=payload, timeout=10)
        
        if res.status_code != 200:
            print(f"❌ Serper API Error (News) - Status Code: {res.status_code}")
            print(f"❌ Serper API Response: {res.text}")
            return {"news": []}
            
        return res.json()
    except Exception as e:
        print(f"❌ Exception calling Serper News API: {e}")
        return {"news": []}


def serper_search(query):
    url = "https://google.serper.dev/search"
    payload = {
        "q": query,
        "num": 5
    }
    
    try:
        res = requests.post(url, headers=headers, json=payload, timeout=10)
        
        if res.status_code != 200:
            print(f"❌ Serper API Error (Search) - Status Code: {res.status_code}")
            print(f"❌ Serper API Response: {res.text}")
            return {"organic": []}
            
        return res.json()
    except Exception as e:
        print(f"❌ Exception calling Serper Search API: {e}")
        return {"organic": []}