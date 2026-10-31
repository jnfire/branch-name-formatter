# Project Architecture

The **Branch Name Formatter** is built with a focus on simplicity, maintainability, and privacy.

## Core Structure

### 1. Logic Layer (`src/core`)
- **`Branch.ts`** / **`BranchTypes.ts`**: The entity representing a generated branch name and its shared types.
- **`BranchManager.ts`**: A singleton class that manages the list of generated branches, handles storage in `localStorage` (via `LocalStorageManager`), and limits the history to 10 records.
- **`FormatTypes.ts`**: Types for the dynamic format system — `BranchFormatTemplate` (a format: id, name, template string, fields, language, visibility), `FieldDefinition` (a field: id, label, type, capitalization), `Capitalization` (`UPPERCASE` / `LOWERCASE` / `AS_IS`), and `LanguageProfile` (the 6 supported languages, used for sanitization rules — independent from the UI language).
- **`FormatManager.ts`**: A static class that owns the three built-in formats and all persistence for formats in `localStorage` — custom formats, hidden built-in formats, the app's default format id, and language overrides for built-in formats (the only field on a built-in format that can be changed in place).
- **`BranchFormatter.ts`**: Turns a `BranchFormatTemplate` + raw field values into the final branch name. Sanitization (accents, dots, spaces, special characters, multiple dashes, and the language-specific rules in `LANGUAGE_RULES` for `/` and characters like `ñ`/`ß`) is always applied and is not configurable; only the per-field capitalization is.

### 2. UI Layer (`src/components`)
- **`App.vue`**: Root layout — header, hero, and swaps between the main view and the configuration view.
- **`AppHeader.vue`**: Sticky header with the language selector and the settings toggle.
- **`AppMainView.vue`** / **`BranchForm.vue`**: The branch generator — renders the fields of the currently selected format dynamically and emits the generated name.
- **`BranchList.vue`** / **`BranchItem.vue`**: Display the branch history.
- **`AppConfigurationView.vue`**: The format management screen — lists all formats, lets you pick the app default, and hosts the editor.
- **`FormatEditor.vue`**: Edits a format. For custom formats, the full form (name, template, language, fields) is editable. For built-in formats, only the visibility switch and the language are editable; the rest is shown read-only (clone the format to fully customize it).
- **`FormatPreview.vue`**: Renders a live example of a format's output using its own field ids as placeholder values.
- **`CustomSelect.vue`** / **`CustomModal.vue`**: Shared, themeable replacements for native `<select>` and confirm dialogs, used throughout the app.
- **`LangSelector.vue`** / **`FlagIcon.vue`**: The UI language switcher.
- **`AppFooter.vue`**: Shows the app version (from `package.json`, injected at build time as `__APP_VERSION__`) linked to its GitHub release, plus license/source links.

### 3. Localization (`src/i18n`)
- One JSON file per supported language (`en`, `es`, `fr`, `de`, `it`, `pt`), loaded by `vue-i18n` in `index.ts`.
- Most UI strings are looked up with `$t('namespace.key')`. Built-in format names and field labels are stored as i18n keys (e.g. `formats.gitflow.name`) inside `FormatManager`'s data rather than literal text, so they follow the selected UI language; custom formats store literal text instead. Components that display a format's `name`/field `label` check for a `.` to decide whether to translate it or show it as-is (see `BranchForm.vue`, `AppConfigurationView.vue`).

## Privacy & Data
No data ever leaves the user's browser. The app uses no external APIs, cookies, analytics or tracking services. Everything is stored in the browser's `localStorage`.

### Shared components

The header, footer, selects, settings card, icons and theme util are shared byte for byte with the other portfolio tools. What differs per app (repository and author) lives in `src/app.config.ts`. See [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).
