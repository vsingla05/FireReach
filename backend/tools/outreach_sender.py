from services.llm_service import generate_text
from services.email_service import send_email


def tool_outreach_automated_sender(company, email, signals, research, employee_name="", employee_role="", employee_dept=""):

    signal_titles = "\n".join([s["title"] for s in signals[:3]])

    employee_context = ""
    if employee_name:
        employee_context = f"\nTarget Employee: {employee_name}\nRole: {employee_role}\nDepartment: {employee_dept}\nSince they are in {employee_dept}, frame the pitch around how our product helps their specific department goals."

    prompt = f"""
Write a personalized outreach email.

Company: {company}{employee_context}

Signals:
{signal_titles}

Research:
{research}

The email must reference the signals explicitly.
It must be signed off by:
Name: Vansh Singla
Email: vnsingla2005@gmail.com
"""

    email_body = generate_text(prompt)

    return email_body