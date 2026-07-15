# Canal YouTube AI

Base de un sistema progresivo para gestionar un canal de YouTube automatizado con IA. El MVP organiza ideas, guiones, prompts visuales, vídeos producidos y métricas manuales sin publicar automáticamente ni conectar APIs externas.

El dashboard incluye un Kanban editorial con cambio de estados, edición de ideas y guiones, gestión de prompts y assets por escena, registro de vídeos y captura manual de métricas. Los assets se pueden subir desde el navegador y previsualizar dentro de cada escena.

## Stack

- Dashboard: Next.js, TypeScript y Tailwind CSS.
- API: FastAPI, SQLAlchemy, Alembic y Pydantic.
- Base de datos: SQLite.
- Desarrollo local: Node.js, Python o Docker Compose.

## Estructura

```text
canal-youtube-ai/
├── apps/
│   ├── api/                  # FastAPI, SQLAlchemy, seed y tests
│   └── dashboard/            # Next.js y Tailwind CSS
├── content/                  # Ideas, guiones, prompts y archivos generados
├── data/                     # Base de datos SQLite local
├── docs/                     # Arquitectura y referencia de API
├── .env.example
└── docker-compose.yml
```

## Requisitos

- Python 3.11 o superior.
- Node.js 20 o superior y npm.
- Opcional: Docker Desktop.

## Inicio rápido en Visual Studio Code

1. Abre la carpeta `canal-youtube-ai` en VS Code.
2. Abre dos terminales desde **Terminal > New Terminal**.
3. En la primera terminal, prepara y ejecuta la API:

```powershell
cd apps/api
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
Copy-Item .env.example .env
.\.venv\Scripts\python.exe -m alembic upgrade head
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

4. En la segunda terminal, prepara y ejecuta el dashboard:

```powershell
cd apps/dashboard
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

5. Abre:
   - Dashboard: `http://localhost:3000`
   - API: `http://localhost:8000`
   - Swagger: `http://localhost:8000/docs`

Alembic crea o actualiza `data/canal_youtube_ai.db`; después la API carga datos demo la primera vez que arranca con una base vacía. Para empezar sin ejemplos, cambia `SEED_DEMO_DATA=false` antes del primer arranque.

### Terminales de VS Code en macOS o Linux

Usa estos equivalentes:

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

```bash
cd apps/dashboard
npm install
cp .env.example .env.local
npm run dev
```

## Ejecutar con Docker

Desde la raíz:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Docker aplica las migraciones automáticamente, expone el dashboard en el puerto `3000`, la API en `8000` y persiste SQLite en `data/`.

## Migraciones de base de datos

Alembic es la fuente de verdad del esquema. Antes de arrancar la API después de actualizar el código:

```powershell
cd apps/api
.\.venv\Scripts\python.exe -m alembic upgrade head
```

Para crear una migración después de modificar modelos:

```powershell
.\.venv\Scripts\python.exe -m alembic revision --autogenerate -m "descripcion del cambio"
.\.venv\Scripts\python.exe -m alembic upgrade head
```

La migración inicial detecta bases SQLite creadas por la versión anterior y conserva sus datos.

## Variables de entorno

### API: `apps/api/.env`

| Variable | Uso |
|---|---|
| `APP_NAME` | Nombre mostrado por FastAPI |
| `APP_ENV` | Entorno actual |
| `APP_DEBUG` | Modo de depuración |
| `DATABASE_URL` | URL opcional de SQLAlchemy; vacía usa SQLite en `data/` |
| `CORS_ORIGINS` | Orígenes permitidos separados por comas |
| `SEED_DEMO_DATA` | Carga datos demo si la base está vacía |
| `ASSETS_DIRECTORY` | Carpeta física de uploads; vacía usa `content/assets/` |
| `MAX_ASSET_SIZE_MB` | Tamaño máximo permitido por archivo, por defecto `100` |

### Dashboard: `apps/dashboard/.env.local`

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL de API accesible desde el navegador |
| `API_INTERNAL_URL` | URL usada por renderizado del servidor |

## Comprobaciones

```powershell
cd apps/api
.\.venv\Scripts\python.exe -m pytest
.\.venv\Scripts\python.exe -m ruff check app tests
```

```powershell
cd apps/dashboard
npm.cmd run build
npm.cmd run typecheck
```

En PowerShell se usa `npm.cmd` para evitar bloqueos de `npm.ps1` causados por algunas políticas de ejecución. En otras terminales también puedes usar `npm`.

## Contenido local

- `content/ideas`, `scripts` y `prompts`: exportaciones editoriales futuras.
- `content/assets`: imágenes, voces y material fuente subido desde el dashboard.
- `content/renders`: vídeos generados antes de publicar.
- `content/published`: copias o manifiestos de publicaciones.

Los archivos pesados y la base SQLite están ignorados por Git. La API admite JPG, PNG, WebP, GIF, MP4, WebM, MOV, MP3, WAV, OGG y M4A, valida su contenido básico y los sirve localmente desde `/media/assets` para su previsualización. También se pueden registrar rutas existentes sin copiar el archivo.

## Próximas etapas

1. Incorporar autenticación local y perfiles de canal.
2. Crear servicios de generación de voz, imagen y vídeo con proveedores intercambiables.
3. Preparar composición y render mediante FFmpeg.
4. Integrar YouTube Data API para publicación asistida.
5. Integrar YouTube Analytics API y experimentos de rendimiento.

Consulta [Arquitectura](docs/ARCHITECTURE.md) y [Referencia API](docs/API.md) para ampliar el sistema.
