# Roadmap

*Leer esto en [Inglés](ROADMAP.md).*

Lo que hace Branch Name Formatter hoy y hacia dónde podría ir. Las ideas están ordenadas por lo que ayudarían; son ideas, no compromisos ni fechas.

## Lo que hace hoy

- Generar nombres de rama de Git válidos y coherentes con tres formatos incluidos (el de la app, GitFlow y Conventional Commits).
- Crear, clonar, editar y borrar tus propios formatos, con vista previa en vivo; importarlos y exportarlos.
- Saneado que siempre da nombres válidos, con un perfil de idioma por formato (seis idiomas).
- Historial de los últimos diez nombres, guardado en el dispositivo.

## Ideas

1. **Compartir un formato por enlace,** sin intercambiar un archivo JSON.
2. **Una longitud máxima por formato,** por los límites de algunos servicios de Git, con un recorte razonable.
3. **Copiar como comando** (`git switch -c <nombre>`) junto a copiar el nombre.
4. **Más formatos incluidos** para gestores de incidencias habituales.
5. **Atajos de teclado** para generar y copiar.
6. **Uso sin conexión** como aplicación instalable (PWA).

## Fuera de alcance

- Cuentas, un backend o cualquier almacenamiento en un servidor: todo se queda en tu navegador.
- Publicidad y rastreo.
