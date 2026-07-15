# Arquitectura

## Principios

- **Local first:** SQLite, métricas manuales y archivos locales permiten validar el flujo antes de integrar servicios externos.
- **Separación por responsabilidades:** FastAPI divide rutas, esquemas, modelos y servicios; Next.js divide páginas, componentes y cliente de datos.
- **Automatización progresiva:** las futuras integraciones deben entrar detrás de servicios propios, sin mezclar proveedores con el dominio editorial.

## Flujo de datos actual

```text
Dashboard Next.js
      |
      | HTTP / JSON
      v
FastAPI routes -> services -> SQLAlchemy -> SQLite
                                      |
                                      v
                              data/canal_youtube_ai.db
```

## Entidades

- `Idea`: unidad editorial y punto de entrada al pipeline.
- `Script`: guion maestro, uno por idea en el MVP.
- `VisualPrompt`: prompt asociado a una escena del guion.
- `SceneAsset`: imagen, vídeo, audio u otro archivo asociado a una escena.
- `Video`: render producido o publicación registrada.
- `VideoMetric`: lectura manual e histórica del rendimiento de un vídeo.

## Próximas integraciones

Las integraciones futuras deberían vivir en módulos como:

```text
apps/api/app/integrations/
├── youtube/
├── voice/
├── image_generation/
├── video_generation/
└── ffmpeg/
```

Cada integración deberá exponer una interfaz interna, leer credenciales desde variables de entorno y mantener los artefactos generados dentro de `content/`.

## Migraciones

El esquema se versiona en `apps/api/migrations/`. La API no crea tablas automáticamente en desarrollo: ejecuta `alembic upgrade head` antes de iniciarla. Docker Compose realiza este paso en su comando de arranque.
