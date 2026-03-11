from services.serper_service import serper_news, serper_search


def get_funding(company):

    query = f'"{company}" AND ("funding" OR "raised" OR "Series" OR "valuation")'

    data = serper_news(query)

    signals = []

    for item in data.get("news", []):

        signals.append({
            "type": "funding",
            "title": item.get("title"),
            "description": item.get("snippet"),
            "source": item.get("source"),
            "date": item.get("date"),
            "url": item.get("link")
        })

    return signals


def get_leadership(company):

    query = f'"{company}" AND ("appointed" OR "steps down" OR "new CEO" OR "new executive")'

    data = serper_news(query)

    signals = []

    for item in data.get("news", []):

        signals.append({
            "type": "leadership",
            "title": item.get("title"),
            "description": item.get("snippet"),
            "source": item.get("source"),
            "date": item.get("date"),
            "url": item.get("link")
        })

    return signals


def get_hiring(company):

    query = f'site:linkedin.com/jobs "{company}"'

    data = serper_search(query)

    signals = []

    for item in data.get("organic", []):

        signals.append({
            "type": "hiring",
            "title": item.get("title"),
            "description": item.get("snippet"),
            "source": "LinkedIn",
            "url": item.get("link")
        })

    return signals


def get_social(company):

    query = f'(site:twitter.com OR site:linkedin.com/posts) "{company}"'

    data = serper_search(query)

    signals = []

    for item in data.get("organic", []):

        signals.append({
            "type": "social",
            "title": item.get("title"),
            "description": item.get("snippet"),
            "date": item.get("date"),
            "url": item.get("link")
        })

    return signals


def tool_signal_harvester(company):

    signals = []

    signals += get_funding(company)
    signals += get_leadership(company)
    signals += get_hiring(company)
    signals += get_social(company)

    return signals