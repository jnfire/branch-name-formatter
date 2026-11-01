# Sistema de diseño compartido

*Leer esto en [Inglés](DESIGN-SYSTEM.md).*

Desplaza, [Base64 to File](https://github.com/jnfire/base64-to-file) y [Branch Name Formatter](https://github.com/jnfire/branch-name-formatter) se ven y se comportan como una misma familia. Todavía no hay un paquete compartido, así que las piezas comunes se **copian byte a byte** en cada repositorio y un script evita que las copias se separen.

## Qué se comparte

| Fichero (en `src/`) | Qué es |
| --- | --- |
| `components/AppHeader.vue` | Nombre de la app, descripción de una línea, botón de compartir opcional y acceso a la configuración |
| `components/AppFooter.vue` | Línea de datos con la versión, enlaces al código y la licencia, botón de metodología opcional y crédito del autor |
| `components/CustomSelect.vue` | Desplegable accesible (navegación con teclado, devolución del foco) |
| `components/LangSelector.vue` | El mismo desplegable con banderas, para el idioma de la interfaz |
| `components/PersonalizationCard.vue` | Tarjeta de configuración con idioma y tema |
| `components/FlagIcon.vue`, `components/SettingsIcon.vue` | Iconos |
| `utils/theme.ts` | Tema claro, oscuro o del sistema, guardado en el dispositivo |

La lista está en `shared-components.json`, junto con el SHA-256 de cada fichero.

## Qué no se comparte

- **`src/app.config.ts`** contiene lo que cambia entre las apps: el repositorio y el autor. Los componentes compartidos lo leen en lugar de llevar nombres escritos a mano.
- **Las traducciones.** Cada app tiene sus diccionarios, pero los componentes compartidos necesitan un conjunto común de claves (`header.*`, `footer.*`, `settings.*` y `shared.select_option`). Un test de cada repo comprueba que los seis idiomas las definen.
- **Los estilos globales.** Los tokens de diseño y las clases de formularios y configuración viven en el CSS global de cada app y deben mantener los mismos nombres y valores.

## Tokens de diseño

| Token | Claro | Oscuro |
| --- | --- | --- |
| `--bg-body` | `#ffffff` | `#111827` |
| `--bg-surface` | `#f9fafb` | `#1f2937` |
| `--bg-surface-hover` | `#f3f4f6` | `#374151` |
| `--text-main` | `#111827` | `#f9fafb` |
| `--text-muted` | `#6b7280` | `#9ca3af` |
| `--border-color` | `#e5e7eb` | `#374151` |
| `--accent-color` | `#000000` | `#ffffff` |
| `--error-color` | `#ef4444` | `#f87171` |

Las tarjetas usan `--bg-surface` sobre `--bg-body`, los controles usan `--bg-body`, y los radios son de 8 px en controles y de 12 px en tarjetas.

## Cambiar un componente compartido

1. Edita el fichero en un repositorio y ejecuta `npm run check:shared -- --update`.
2. Copia los ficheros cambiados y `shared-components.json` a los otros dos repositorios.
3. Ejecuta los tests en los tres.

El CI ejecuta `npm run check:shared` en cada pull request y antes de cada despliegue, así que una copia editada por separado rompe el build.

## Hacia un paquete

Cuando el conjunto compartido deje de cambiar a menudo, los mismos ficheros pueden convertirse en un paquete pequeño con licencia abierta (MIT, porque es una librería y no una app) que instalen las tres apps y el sitio de portafolio, y `check:shared` desaparece. Hasta entonces, copiar mantiene las herramientas independientes y sencillas de desplegar.
