FROM python:3.11-slim

WORKDIR /app

COPY src /app/src
COPY .env /app/.env

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5007

CMD ["uvicorn", "main:app", "--app-dir", "src", "--host", "0.0.0.0", "--port", "5007"]


