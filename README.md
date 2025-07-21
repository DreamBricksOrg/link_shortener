
# 🔗 Link Shortener - FastAPI Project

Este é um projeto de encurtador de links interno, desenvolvido com **FastAPI**, **MongoDB Atlas** e **Structlog**, que permite:

- Criar links curtos com base em URLs fornecidas
- Gerar QR Codes (PNG e SVG) para esses links
- Redirecionar acessos aos links originais
- Registrar logs de acesso com IP, data/hora, navegador e dispositivo
- Executar callbacks HTTP opcionais a cada acesso

## 🚀 Tecnologias Usadas

- Python 3.11+
- FastAPI
- MongoDB (via `motor`)
- Structlog
- QR Code (bibliotecas `qrcode` e `segno`)
- User-Agent parser (`user-agents`)
- ShortUUID para geração dos slugs
- httpx (para envio de callbacks)

## 📁 Estrutura

```
link_shortener/
├── src/
│   ├── main.py               # Entrada da aplicação FastAPI
│   ├── routes/               # Módulo de rotas organizadas
│   ├── models/               # Schemas de entrada
│   ├── schemas/              # Schemas de resposta
│   └── utils/
│       ├── qr.py             # Geração de QR Codes
│       ├── log.py            # Logger com structlog
│       └── device.py         # Extração de info do User-Agent
├── static/                   # Armazena os QR codes gerados
├── requirements.txt
├── Dockerfile
├── .env.example              # Exemplo de variáveis de ambiente
└── README.md
```

## ⚙️ Instalação

```bash
git clone <repo>
cd link_shortener
cp .env.example .env
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```

## 🐳 Docker

```bash
docker build -t link-shortener .
docker run -d -p 8000:8000 --env-file .env link-shortener
```

## 📨 Endpoints

- `POST /shorten` — cria link curto + QR code. Campos:
  - `name` (str) — nome do projeto ou identificador
  - `url` (str) — URL de destino
  - `callback_url` (str, opcional) — endpoint para ser notificado quando acessado
  - `slug` (str, opcional) — string personalizada (se disponível)

- `GET /{slug}` — redireciona e registra acesso, além de executar callback se configurado

## 🔐 Variáveis de Ambiente

Configure o MongoDB Atlas com a variável no `.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/link_db
```

## 📚 Documentação

Acesse a interface de testes interativa em:  
📎 `http://oseuhost/docs` (Swagger UI)

## 🧪 Testes e CI/CD

- Implementar testes com `pytest`
- Verificar redirecionamentos e logs
- Mockar callback URLs
