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

    res = requests.post(url, headers=headers, json=payload)

    return res.json()


def serper_search(query):

    url = "https://google.serper.dev/search"

    payload = {
        "q": query,
        "num": 5
    }

    res = requests.post(url, headers=headers, json=payload)

    return res.json()


def get_linkedin_snippet(name, company):
    url = "https://google.serper.dev/search"
    query = f"site:linkedin.com/in/ \"{name}\" \"{company}\""
    
    payload = {
        "q": query,
        "num": 1
    }

    try:
        res = requests.post(url, headers=headers, json=payload)
        data = res.json()
        
        if "organic" in data and len(data["organic"]) > 0:
            first_result = data["organic"][0]
            snippet = first_result.get("snippet", "")
            title = first_result.get("title", "")
            return f"LinkedIn Title: {title}\nLinkedIn Bio Snippet: {snippet}"
            
    except Exception as e:
        print(f"LinkedIn fetch failed: {e}")
        
    return ""