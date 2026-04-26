FROM python:3.13-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
 && rm -rf /var/lib/apt/lists/*

RUN python -m venv .venv

COPY requirements.txt ./
RUN ./.venv/bin/pip install --no-cache-dir -r requirements.txt

COPY . ./

RUN groupadd -g 10001 appuser && \
    useradd -u 10001 -g appuser -s /usr/sbin/nologin -M appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
