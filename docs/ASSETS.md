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

## Subida local

El dashboard permite subir archivos directamente a una escena. La API:

- admite JPG, PNG, WebP, GIF, MP4, WebM, MOV, MP3, WAV, OGG y M4A;
- compara extensión, MIME y firma básica del contenido;
- aplica el límite definido en `MAX_ASSET_SIZE_MB`;
- guarda el archivo en `content/assets/scene-{prompt_id}/` con un nombre interno único;
- conserva el nombre original y sirve una URL local para la previsualización;
- elimina el archivo físico cuando se borra su registro.

Los archivos se guardan fuera de Git. En Docker, `content/` está montado como volumen para que los uploads persistan al recrear los contenedores.

## Rutas existentes

Como alternativa, se puede registrar una ruta y sus metadatos sin copiar el archivo. Estas rutas deberían apuntar a `content/assets/` para mantener una convención única y facilitar la futura integración con FFmpeg. Solo los archivos subidos por la API tienen previsualización gestionada y borrado físico automático.
