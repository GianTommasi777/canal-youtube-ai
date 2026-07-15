# API del MVP

La documentación interactiva está disponible en `http://localhost:8000/docs`.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Estado de la API |
| `GET` | `/api/dashboard/summary` | Resumen para el dashboard |
| `POST` | `/api/ideas` | Crear idea |
| `GET` | `/api/ideas` | Listar ideas |
| `GET` | `/api/ideas/{id}` | Ver idea, guion y prompts |
| `PATCH` | `/api/ideas/{id}` | Editar datos de una idea |
| `PATCH` | `/api/ideas/{id}/status` | Actualizar estado |
| `POST` | `/api/ideas/{id}/scripts` | Crear guion |
| `PATCH` | `/api/scripts/{id}` | Editar guion |
| `POST` | `/api/scripts/{id}/visual-prompts` | Guardar prompt visual |
| `PATCH` | `/api/scripts/visual-prompts/{id}` | Editar prompt visual |
| `DELETE` | `/api/scripts/visual-prompts/{id}` | Eliminar prompt visual |
| `POST` | `/api/visual-prompts/{id}/assets` | Asociar asset a una escena |
| `POST` | `/api/visual-prompts/{id}/assets/upload` | Subir y asociar un archivo local (`multipart/form-data`) |
| `PATCH` | `/api/assets/{id}` | Editar asset o su estado |
| `DELETE` | `/api/assets/{id}` | Eliminar asset de una escena |
| `POST` | `/api/videos` | Registrar vídeo |
| `GET` | `/api/videos` | Listar vídeos |
| `PATCH` | `/api/videos/{id}` | Editar vídeo o estado |
| `POST` | `/api/videos/{id}/metrics` | Registrar lectura manual |
| `GET` | `/api/metrics` | Listar lecturas manuales |

Los archivos subidos se sirven desde `/media/assets/{ruta}`. El campo `file` es obligatorio en el endpoint de upload; `name`, `source` y `notes` son opcionales. El límite por defecto es de 100 MB y se configura con `MAX_ASSET_SIZE_MB`.
