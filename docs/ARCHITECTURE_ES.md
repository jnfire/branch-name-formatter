# Arquitectura del Proyecto

El **Branch Name Formatter** está construido con un enfoque en la simplicidad, mantenibilidad y privacidad.

## Estructura Principal

### 1. Capa de Lógica (`src/core`)
- **`Branch.ts`** / **`BranchTypes.ts`**: La entidad que representa una rama generada y sus tipos compartidos.
- **`BranchManager.ts`**: Una clase Singleton que gestiona la lista de ramas generadas, maneja el almacenamiento en `localStorage` (vía `LocalStorageManager`) y limita el historial a 10 registros.
- **`FormatTypes.ts`**: Tipos del sistema de formatos dinámico — `BranchFormatTemplate` (un formato: id, nombre, plantilla, campos, idioma, visibilidad), `FieldDefinition` (un campo: id, etiqueta, tipo, capitalización), `Capitalization` (`UPPERCASE` / `LOWERCASE` / `AS_IS`) y `LanguageProfile` (los 6 idiomas soportados, usados para el saneado — independiente del idioma de la interfaz).
- **`FormatManager.ts`**: Una clase estática que define los tres formatos predefinidos y gestiona toda la persistencia de formatos en `localStorage` — formatos personalizados, formatos predefinidos ocultos, el id del formato predeterminado de la app, y los overrides de idioma para formatos predefinidos (el único campo de un formato predefinido que se puede cambiar in situ).
- **`FormatTemplate.ts`**: Revisa una plantilla en busca de errores: tokens que no coinciden con ningún campo, campos sin usar e ids de campo repetidos.
- **`BranchFormatter.ts`**: Convierte un `BranchFormatTemplate` + los valores de campo en el nombre de rama final, o en sus segmentos (`formatSegments`) cuando la interfaz necesita colorear cada campo. El saneado (tildes, puntos, espacios, caracteres especiales, guiones múltiples, y las reglas específicas por idioma en `LANGUAGE_RULES` para `/` y caracteres como `ñ`/`ß`) se aplica siempre y no es configurable; solo la capitalización por campo lo es.

### 2. Capa de interfaz (`src/components`, `src/composables`)
La aplicación tiene tres pantallas, que se eligen con el hash de la URL (`src/composables/useRoute.ts`): el generador (`#/`), los formatos (`#/formatos`, `#/formatos/<id>`, `#/formatos/nuevo`) y los ajustes (`#/ajustes`). El botón Atrás del navegador funciona entre ellas. Una pantalla con cambios sin guardar puede registrar una guarda, de modo que al pasar a otra pantalla desde dentro de la aplicación se pregunta antes.

- **`App.vue`**: Estructura raíz. Cabecera, la pantalla que corresponde a la ruta y el pie.
- **`AppHeader.vue`**: Cabecera fija con el botón de ajustes (componente compartido).
- **Generador**: `AppMainView.vue` guarda el estado (formato elegido, valores de los campos, historial). `BranchForm.vue` es el selector de formato y los campos; `BranchOutput.vue` muestra el nombre y el botón de copiar; `BranchList.vue` / `BranchItem.vue` son el historial. El nombre se actualiza mientras escribes y al copiar también se guarda en el historial. El formato elegido se guarda como predeterminado, así que es el mismo en la próxima visita.
- **`BranchName.vue`**: Dibuja un nombre como segmentos, un color por campo del formato (`--seg-1` a `--seg-6` en `base.css`, de forma cíclica), con los separadores en gris. Lo usan el generador y la vista previa del editor. Los segmentos salen de `BranchFormatter.formatSegments`.
- **Formatos**: `FormatsView.vue` tiene la lista (`FormatList.vue`) a un lado y el detalle al otro, y en pantallas estrechas son dos pasos. Los formatos incluidos se abren en solo lectura (`FormatReadonly.vue`), con un selector de idioma y un botón para clonarlos. Los propios se abren en `FormatEditor.vue`. `FormatPreview.vue` muestra el resultado, con un ejemplo opcional para probar; `FormatTemplateView.vue` dibuja una plantilla con sus tokens en color. El editor avisa de los tokens que no coinciden con ningún campo y de los campos que no están en la plantilla (`src/core/FormatTemplate.ts`), sin impedir guardar.
- **Ajustes**: `SettingsView.vue` tiene `PersonalizationCard.vue` (idioma y tema, compartida) y `BackupCard.vue` (exportar e importar los formatos, con el resultado en la propia tarjeta).
- **`CustomSelect.vue`** / **`CustomModal.vue`**: Sustitutos compartidos y con tema de `<select>` nativo y de los diálogos de confirmación. Los modales solo se usan para confirmar un borrado y para preguntar si se descartan cambios.
- **`LangSelector.vue`** / **`FlagIcon.vue`**: El selector de idioma de la interfaz.
- **`AppIcon.vue`**: Los pocos iconos que usan las pantallas.
- **`AppFooter.vue`**: Muestra la versión de la aplicación (de `package.json`, inyectada al compilar como `__APP_VERSION__`) enlazada a su release de GitHub, y los enlaces de licencia y código.
- **Estilos**: los tokens (incluido el color de acento y los colores de los campos) están en `assets/base.css`, y la disposición de las tres pantallas en `assets/branch.css`. El color de acento solo se define aquí, así que las otras herramientas del portafolio mantienen el suyo.

### 3. Localización (`src/i18n`)
- Un archivo JSON por idioma soportado (`en`, `es`, `fr`, `de`, `it`, `pt`), cargados por `vue-i18n` en `index.ts`.
- La mayoría de textos de la interfaz se resuelven con `$t('namespace.clave')`. Los nombres y etiquetas de campo de los formatos predefinidos se guardan como claves i18n (p. ej. `formats.gitflow.name`) dentro de los datos de `FormatManager`, en vez de texto literal, para que sigan el idioma de interfaz seleccionado; los formatos personalizados guardan texto literal en su lugar. Los componentes que muestran el `name`/`label` de un formato comprueban si contiene un punto para decidir si traducirlo o mostrarlo tal cual (ver `BranchForm.vue`, `FormatList.vue`, `FormatsView.vue`).

## Privacidad y Datos
Ningún dato sale del navegador del usuario. La app no usa APIs externas, cookies, analítica ni servicios de rastreo. Todo se almacena en el `localStorage` del navegador.

### Componentes compartidos

La cabecera, el pie, los selectores, la tarjeta de configuración, los iconos y la utilidad de tema se comparten byte a byte con las otras herramientas del portafolio. Lo que cambia en cada app (repositorio y autor) está en `src/app.config.ts`. Ver [`DESIGN-SYSTEM-es.md`](DESIGN-SYSTEM-es.md).
