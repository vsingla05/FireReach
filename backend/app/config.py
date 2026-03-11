import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SERPER_API_KEY = os.getenv("SERPER_API_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    



import os
from dotenv import load_dotenv

load_dotenv()

SERPER_API_KEY = os.getenv("SERPER_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

SERPER_SEARCH_URL = "https://google.serper.dev/search"
SERPER_NEWS_URL = "https://google.serper.dev/news"


SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")