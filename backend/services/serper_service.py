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