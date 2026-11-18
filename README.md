
# 🔗 Link Shortener - FastAPI Project

## Design system

O design system DreamBricks está em [`docs/design_system/`](docs/design_system/readme.md). O frontend usa os tokens e o logo servidos de `src/static/design_system/`, com ajustes de interface em `src/static/css/dreambricks.css`. Ao atualizar o sistema de origem, sincronize os tokens e assets usados em produção.

## Prévia local com dados fictícios

O arquivo `compose.preview.yaml` inicia um MongoDB dedicado, com volume próprio e porta acessível somente em `127.0.0.1:27022`. Ele não usa o MongoDB Atlas nem as outras bases locais.

No PowerShell, a partir da raiz do projeto:

```powershell
docker compose -f compose.preview.yaml up -d
$env:PYTHONPATH = (Resolve-Path src).Path
$env:MONGO_URI = 'mongodb://127.0.0.1:27022'
$env:MONGO_DB = 'link_shortener_preview'
$env:BASE_URL = 'http://127.0.0.1:5000'
$env:PREVIEW_PASSWORD = '<escolha-uma-senha-local>'
.\venv\Scripts\python.exe src\scripts\seed_preview.py
.\venv\Scripts\python.exe -m uvicorn src.main:app --host 127.0.0.1 --port 5000
```

Acesse `http://127.0.0.1:5000/auth/` com o usuário `preview` e a senha escolhida na primeira execução do seed. O script cria sete links fictícios, acessos de exemplo e seus QR codes; execuções posteriores preservam a senha e não duplicam links ou acessos.

Este é um projeto de encurtador de links interno, desenvolvido com **FastAPI**, **MongoDB Atlas** e **Structlog**, que permite:

- Criar links curtos com base em URLs fornecidas
- Gerar QR Codes (PNG e SVG) para esses links
- Redirecionar acessos aos links originais
- Registrar logs de acesso com IP, data/hora, navegador e dispositivo
- Executar callbacks HTTP opcionais a cada acesso
- Acessar painel admin protegido por JWT para criar, exportar, editar e excluir links

✨ Funcionalidades Extras

- Interface admin com listagem, filtros e exportação de CSV
- No painel Admin, visão agrupada por endereço antes do `?`: URLs com parâmetros diferentes ficam recolhidas no mesmo grupo, com contagem de links. Abra o grupo para editar cada link; use **Individuais** para ver todos os cartões separados. Filtros e paginação funcionam nas duas visões.
- Deleção segura: logs são mantidos com slug versionado
- QR Codes salvos em volume persistente via Docker

## 🚀 Tecnologias Usadas

- Python 3.11+
- FastAPI
- MongoDB (via `motor`)
- Structlog
- QR Code (`segno`)
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
├   ├── static/                   # Armazena os QR codes gerados
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
docker run -d \
  --name shortener \
  -p 5007:5007 \
  --env-file .env \
  -v $(pwd)/src/static:/app/src/static \
  link_shortener
```
✅ Os QR codes serão salvos em src/static e persistem entre recriações do container.

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
BASE_URL=http://oseuhost:5007
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<cluster>
MONGO_DB=<database>
LOG_API=<log_api>
LOG_ID=<log_id>
ADMIN_CREATION_TOKEN=<admin_token>
ACCESS_TOKEN_EXPIRE_MINUTES=3600
JWT_SECRET=<jwt_secret>
JWT_ALGORITHM=HS256
```

## 📚 Documentação

Acesse a interface de testes interativa em:  
📎 `http://oseuhost/docs` (Swagger UI)

## 🧪 Testes e CI/CD

- Implementar testes com `pytest`
- Verificar redirecionamentos e logs
- Mockar callback URLs
