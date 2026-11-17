FROM python:3.11-slim

WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends git ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/src

EXPOSE 5000
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:5000/alive', timeout=2)" || exit 1
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "5000", "--lifespan=on", "--log-level", "info"]
