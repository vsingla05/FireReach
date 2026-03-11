from google import genai
from config import GEMINI_API_KEY

# Initialize client with API key
client = genai.Client(api_key=GEMINI_API_KEY)


def generate_text(prompt):
    """Generate text using Gemini via the new google-genai SDK."""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text