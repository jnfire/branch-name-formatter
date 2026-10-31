# Evolución

*Leer esto en [Inglés](README.md).*

Cómo Branch Name Formatter pasó de su primer commit a hoy, con las capturas para verlo.

![Branch Name Formatter en tres etapas, escritorio](branch-name-formatter-evolution-desktop.png)

## La historia

Branch Name Formatter es la aplicación cuyo diseño más ha cambiado, y su cambio más radical es el rediseño de agosto de 2026. El generador oscuro con una sola fila de campos pasó a ser una herramienta construida alrededor de formatos que defines tú: un editor con vista previa en vivo, mayúsculas por campo, perfiles de idioma y un historial. En octubre se alineó con las otras herramientas, lo que simplificó la página (sin bloque de presentación, los hechos en el pie) y le dio los componentes compartidos.

Versiones: la v0.1.0 (octubre de 2025) y la v0.2.0 (mayo de 2026) se quedan como estaban. El rediseño de agosto de 2026 se documentó como 1.0.0 en el registro de cambios pero nunca se etiquetó; sale ahora junto con el trabajo de octubre.

## Cronología

| Cuándo | Qué pasó |
| --- | --- |
| 2024–2025 | Primer commit en diciembre de 2024 (el registro de cambios fecha el desarrollo inicial en abril de 2024). |
| Octubre de 2025 | Primera versión (v0.1.0): un "branch-name-generator" oscuro con una sola fila de campos. En la misma versión se unificó el estilo visual con las otras herramientas local-first del autor y llegaron el inglés y el español. |
| Mayo de 2026 | v0.2.0: selector de idioma propio con banderas y mejor accesibilidad con teclado. |
| Agosto de 2026 | Rediseño completo y un nuevo sistema de formatos: el editor de formatos propios con vista previa en vivo, mayúsculas por campo, perfiles de idioma y el historial. |
| Octubre de 2026 | Software libre (AGPL-3.0), sin Google Analytics ni banner de cookies, un sistema de diseño compartido con las otras dos herramientas, CI que condiciona cada despliegue y la versión 1.0.0, el paso siguiente a la 0.1.0 y la 0.2.0. |

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

Diseñado y dirigido por [Javier Nicolás Pérez Mesa](https://github.com/jnfire): el producto, la arquitectura y las decisiones de diseño son del autor. La IA ha formado parte del trabajo como un experimento deliberado para aprender tecnología nueva: Gemini CLI, Antigravity, GitHub Copilot y Claude Code, probados uno tras otro. Empezó con pequeñas intervenciones y, a medida que avanzaba el experimento, fue ganando autonomía, siempre mediante pull requests que revisa el autor. El autor empezó poniendo ladrillos y ahora trabaja más como ingeniero y arquitecto, sin olvidar de dónde viene. Los commits hechos con Claude Code llevan un `Co-Authored-By`.
