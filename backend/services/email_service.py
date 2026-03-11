import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")


def send_email(to_email, subject, body):

    try:
        response = resend.Emails.send({
            "from": "FireReach <onboarding@resend.dev>",
            "to": [to_email],
            "subject": subject,
            "html": f"<p>{body}</p>"
        })

        print("Email sent:", response)
        return "Email sent successfully"

    except Exception as e:
        print("Resend error:", e)
        raise e