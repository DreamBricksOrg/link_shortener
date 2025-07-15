# Link Shortener - FastAPI Project

Este é um projeto de encurtador de links interno, desenvolvido com **FastAPI**, **MongoDB Atlas** e **Structlog**, que permite:

- Criar links curtos com base em URLs fornecidas
- Gerar QR Codes (PNG e SVG) para esses links
- Redirecionar acessos aos links originais
- Registrar logs de acesso com IP, data/hora, navegador e dispositivo

## Tecnologias Usadas

- Python 3.11+
- FastAPI
- MongoDB (via `motor`)
- Structlog
- QR Code (bibliotecas `qrcode` e `segno`)
- User-Agent parser (`user-agents`)
- ShortUUID para geração dos slugs

## 📁 Estrutura

```
link_shortener/
├── src/
│   ├── main.py               # Entrada da aplicação FastAPI
│   └── utils/
│       ├── qr.py             # Geração de QR Codes
│       ├── log.py            # Logger com structlog
│       └── device.py         # Extração de info do User-Agent
├── static/                   # Armazena os QR codes gerados
├── requirements.txt
├── Dockerfile
├── .env.example              # Variáveis de ambiente
└── README.md
```

## 📦 Instalação

```bash
git clone <repo>
cd link_shortener
cp .env.example .env
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🐳 Docker

```bash
docker build -t link-shortener .
docker run -d -p 8000:8000 --env-file .env link-shortener
```

## Endpoints

- `POST /shorten` — cria link curto + QR code
- `GET /{slug}` — redireciona e registra acesso

## Variáveis de Ambiente

Verifique `.env.example` para configurar conexão com o MongoDB Atlas.
