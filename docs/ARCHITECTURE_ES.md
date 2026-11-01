# Arquitectura del Proyecto

El **Branch Name Formatter** está construido con un enfoque en la simplicidad, mantenibilidad y privacidad.

## Estructura Principal

### 1. Capa de Lógica (`src/core`)
- **`Branch.ts`** / **`BranchTypes.ts`**: La entidad que representa una rama generada y sus tipos compartidos.
- **`BranchManager.ts`**: Una clase Singleton que gestiona la lista de ramas generadas, maneja el almacenamiento en `localStorage` (vía `LocalStorageManager`) y limita el historial a 10 registros.
- **`FormatTypes.ts`**: Tipos del sistema de formatos dinámico — `BranchFormatTemplate` (un formato: id, nombre, plantilla, campos, idioma, visibilidad), `FieldDefinition` (un campo: id, etiqueta, tipo, capitalización), `Capitalization` (`UPPERCASE` / `LOWERCASE` / `AS_IS`) y `LanguageProfile` (los 6 idiomas soportados, usados para el saneado — independiente del idioma de la interfaz).
- **`FormatManager.ts`**: Una clase estática que define los tres formatos predefinidos y gestiona toda la persistencia de formatos en `localStorage` — formatos personalizados, formatos predefinidos ocultos, el id del formato predeterminado de la app, y los overrides de idioma para formatos predefinidos (el único campo de un formato predefinido que se puede cambiar in situ).
- **`BranchFormatter.ts`**: Convierte un `BranchFormatTemplate` + los valores de campo en el nombre de rama final. El saneado (tildes, puntos, espacios, caracteres especiales, guiones múltiples, y las reglas específicas por idioma en `LANGUAGE_RULES` para `/` y caracteres como `ñ`/`ß`) se aplica siempre y no es configurable; solo la capitalización por campo lo es.

### 2. Capa de Interfaz (`src/components`)
- **`App.vue`**: Layout raíz — cabecera, hero, y alterna entre la vista principal y la de configuración.
- **`AppHeader.vue`**: Cabecera fija con el selector de idioma y el botón de configuración.
- **`AppMainView.vue`** / **`BranchForm.vue`**: El generador de ramas — renderiza dinámicamente los campos del formato seleccionado y emite el nombre generado.
- **`BranchList.vue`** / **`BranchItem.vue`**: Muestran el historial de ramas.
- **`AppConfigurationView.vue`**: La pantalla de gestión de formatos — lista todos los formatos, permite elegir el predeterminado de la app, y aloja el editor.
- **`FormatEditor.vue`**: Edita un formato. Para formatos personalizados, el formulario completo (nombre, plantilla, idioma, campos) es editable. Para formatos predefinidos, solo el interruptor de visibilidad y el idioma son editables; el resto se muestra en solo lectura (clona el formato para personalizarlo del todo).
- **`FormatPreview.vue`**: Renderiza un ejemplo en vivo del resultado de un formato, usando los propios id de sus campos como valores de ejemplo.
- **`CustomSelect.vue`** / **`CustomModal.vue`**: Sustitutos compartidos y temáticos de los `<select>` nativos y los diálogos de confirmación, usados en toda la app.
- **`LangSelector.vue`** / **`FlagIcon.vue`**: El selector de idioma de la interfaz.
- **`AppFooter.vue`**: Muestra la versión de la app (desde `package.json`, inyectada en build como `__APP_VERSION__`) enlazada a su release de GitHub, más los enlaces de licencia/código fuente.

### 3. Localización (`src/i18n`)
- Un archivo JSON por idioma soportado (`en`, `es`, `fr`, `de`, `it`, `pt`), cargados por `vue-i18n` en `index.ts`.
- La mayoría de textos de la interfaz se resuelven con `$t('namespace.clave')`. Los nombres y etiquetas de campo de los formatos predefinidos se guardan como claves i18n (p. ej. `formats.gitflow.name`) dentro de los datos de `FormatManager`, en vez de texto literal, para que sigan el idioma de interfaz seleccionado; los formatos personalizados guardan texto literal en su lugar. Los componentes que muestran el `name`/`label` de un formato comprueban si contiene un punto para decidir si traducirlo o mostrarlo tal cual (ver `BranchForm.vue`, `AppConfigurationView.vue`).

## Privacidad y Datos
Ningún dato sale del navegador del usuario. La app no usa APIs externas, cookies, analítica ni servicios de rastreo. Todo se almacena en el `localStorage` del navegador.

### Componentes compartidos

La cabecera, el pie, los selectores, la tarjeta de configuración, los iconos y la utilidad de tema se comparten byte a byte con las otras herramientas del portafolio. Lo que cambia en cada app (repositorio y autor) está en `src/app.config.ts`. Ver [`DESIGN-SYSTEM-es.md`](DESIGN-SYSTEM-es.md).
