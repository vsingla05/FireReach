# Use an official, lightweight Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY . .

# Expose the port that the Flask app runs on
EXPOSE 5000

# Start the application with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
