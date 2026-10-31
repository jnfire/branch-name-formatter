# Evolución

*Leer esto en [Inglés](README.md).*

Cómo Branch Name Formatter pasó de su primer commit a hoy, con las capturas para verlo.

![Branch Name Formatter en tres etapas, escritorio](branch-name-formatter-evolution-desktop.png)

## Cronología

| Cuándo | Qué pasó |
| --- | --- |
| 2024–2025 | Primer commit en diciembre de 2024 (el registro de cambios fecha el desarrollo inicial en abril de 2024). |
| Octubre de 2025 | Primera versión (v0.1.0): un "branch-name-generator" oscuro con una sola fila de campos. En la misma versión se unificó el estilo visual con las otras herramientas local-first del autor y llegaron el inglés y el español. |
| Mayo de 2026 | v0.2.0: selector de idioma propio con banderas y mejor accesibilidad con teclado. |
| Agosto de 2026 | Rediseño completo y un nuevo sistema de formatos: el editor de formatos propios con vista previa en vivo, mayúsculas por campo, perfiles de idioma y el historial. |
| Octubre de 2026 | Software libre (AGPL-3.0), sin Google Analytics ni banner de cookies, un sistema de diseño compartido con las otras dos herramientas, CI que condiciona cada despliegue y la primera versión estable. |

## En cifras

| | Antes (agosto de 2026) | Ahora |
| --- | --- | --- |
| Tests automáticos | 63 | 80 |
| Licencia | Todos los derechos reservados | AGPL-3.0 |
| Analítica | Google Analytics y banner de cookies | Ninguna |
| Despliegue | Solo si pasan los tests | Solo si pasan lint, formato, componentes compartidos, tests y build |
| Avisos de dependencias (npm audit) | Gravedad alta (vue-i18n) | Ninguno |

La columna "antes" es el estado del proyecto el 28 de agosto de 2026, justo antes de la ronda de trabajo que se describe arriba.

## Imágenes

Todas las imágenes están en esta carpeta y en [`../screenshots`](../screenshots); usan datos de ejemplo y no muestran las teselas del mapa porque se capturaron sin conexión.

- [`branch-name-formatter-evolution-desktop.png`](branch-name-formatter-evolution-desktop.png): Tres etapas una junto a otra, en escritorio
- [`branch-name-formatter-evolution-mobile.png`](branch-name-formatter-evolution-mobile.png): Las mismas tres etapas en el móvil
- [`branch-name-formatter-formats.png`](../screenshots/branch-name-formatter-formats.png): El editor de formatos propios

## Cómo se ha construido

Diseñado y dirigido por [Javier Nicolás Pérez Mesa](https://github.com/jnfire): el producto, la arquitectura y las decisiones de diseño son suyos. Buena parte de la implementación se ha escrito con ayuda de IA ([Claude Code](https://claude.com/claude-code)), trabajando bajo su dirección y mediante pull requests que él revisa; los commits hechos así llevan un `Co-Authored-By`.
