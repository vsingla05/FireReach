from services.llm_service import generate_text
from services.email_service import send_email


def tool_outreach_automated_sender(company, email, signals, research):

    signal_titles = "\n".join([s["title"] for s in signals[:3]])

    prompt = f"""
Write a personalized outreach email.

Company: {company}

Signals:
{signal_titles}

Research:
{research}

The email must reference the signals explicitly.
"""

    email_body = generate_text(prompt)

    # send_email(email, "Quick idea regarding your recent growth", email_body)

    return email_body