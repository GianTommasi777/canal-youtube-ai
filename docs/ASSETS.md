# Assets por escena

Cada `SceneAsset` pertenece a un `VisualPrompt`, que representa una escena del guion.

## Tipos

- `image`: ilustración, fotografía, miniatura o frame.
- `video`: clip generado, stock o grabación.
- `audio`: voz, música o efecto.
- `other`: archivos auxiliares.

## Estados

- `planned`: definido, pero todavía no disponible.
- `ready`: archivo disponible para revisión.
- `approved`: aprobado para el render.
- `rejected`: descartado o pendiente de sustitución.

El MVP registra rutas y metadatos, pero no copia ni sube físicamente archivos. Las rutas deberían apuntar a `content/assets/` para mantener una convención única y facilitar la futura integración con FFmpeg.
