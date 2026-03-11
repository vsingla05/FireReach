import smtplib
from email.mime.text import MIMEText
from config import SMTP_EMAIL, SMTP_PASSWORD


def send_email(to_email, subject, body):

    msg = MIMEText(body)

    msg["Subject"] = subject
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email

    server = smtplib.SMTP("smtp.gmail.com", 587)

    server.starttls()

    server.login(SMTP_EMAIL, SMTP_PASSWORD)

    server.sendmail(SMTP_EMAIL, to_email, msg.as_string())

    server.quit()