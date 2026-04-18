import smtplib
import ssl
from email.message import EmailMessage
from config import SMTP_EMAIL, SMTP_PASSWORD

def send_email(to_email, subject, body):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("⚠️ SMTP credentials (SMTP_EMAIL, SMTP_PASSWORD) not found in .env")
        return False

    try:
        msg = EmailMessage()
        # Plain text fallback
        msg.set_content(body)
        
        msg['Subject'] = subject
        msg['From'] = f"FireReach Outreach <{SMTP_EMAIL}>"
        msg['To'] = to_email
        
        # HTML version for nicely formatted emails
        html_body = body.replace("\n", "<br>")
        msg.add_alternative(html_body, subtype='html')

        # Connect to Gmail's SMTP server
        context = ssl.create_default_context()
        smtp_server = "smtp.gmail.com"
        smtp_port = 465
        
        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
            
        print(f"✅ SMTP Email sent successfully to {to_email}")
        return True

    except Exception as e:
        print(f"\n⚠️ SMTP Delivery Failed: {e}")
        return False