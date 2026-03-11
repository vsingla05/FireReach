from groq import Groq
from config import GROQ_API_KEY

# Initialize client with API key
client = Groq(api_key=GROQ_API_KEY)


def generate_text(prompt):
    """Generate text using Groq via the groq SDK."""
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content