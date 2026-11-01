# Project Architecture

The **Branch Name Formatter** is built with a focus on simplicity, maintainability, and privacy.

## Core Structure

### 1. Logic Layer (`src/core`)
- **`Branch.ts`** / **`BranchTypes.ts`**: The entity representing a generated branch name and its shared types.
- **`BranchManager.ts`**: A singleton class that manages the list of generated branches, handles storage in `localStorage` (via `LocalStorageManager`), and limits the history to 10 records.
- **`FormatTypes.ts`**: Types for the dynamic format system — `BranchFormatTemplate` (a format: id, name, template string, fields, language, visibility), `FieldDefinition` (a field: id, label, type, capitalization), `Capitalization` (`UPPERCASE` / `LOWERCASE` / `AS_IS`), and `LanguageProfile` (the 6 supported languages, used for sanitization rules — independent from the UI language).
- **`FormatManager.ts`**: A static class that owns the three built-in formats and all persistence for formats in `localStorage` — custom formats, hidden built-in formats, the app's default format id, and language overrides for built-in formats (the only field on a built-in format that can be changed in place).
- **`FormatTemplate.ts`**: Checks a template for mistakes: tokens that match no field, fields that are not used and repeated field ids.
- **`BranchFormatter.ts`**: Turns a `BranchFormatTemplate` + raw field values into the final branch name, or into its segments (`formatSegments`) when the UI needs to color each field. Sanitization (accents, dots, spaces, special characters, multiple dashes, and the language-specific rules in `LANGUAGE_RULES` for `/` and characters like `ñ`/`ß`) is always applied and is not configurable; only the per-field capitalization is.

### 2. UI Layer (`src/components`, `src/composables`)
The app has three screens, chosen by the hash of the URL (`src/composables/useRoute.ts`): the generator (`#/`), the formats (`#/formatos`, `#/formatos/<id>`, `#/formatos/nuevo`) and the settings (`#/ajustes`). The browser's Back button works between them. A screen with changes that are not saved can register a guard, so that moving to another screen from inside the app asks first.

- **`App.vue`**: Root layout. Header, the screen that matches the route, and the footer.
- **`AppHeader.vue`**: Sticky header with the settings toggle (shared component).
- **Generator**: `AppMainView.vue` owns the state (selected format, field values, history). `BranchForm.vue` is the format selector and the fields; `BranchOutput.vue` shows the name and the copy button; `BranchList.vue` / `BranchItem.vue` are the history. The name updates while you type and copying also saves it to the history. The selected format is stored as the default one, so it is the same on the next visit.
- **`BranchName.vue`**: Draws a name as segments, one color per field of the format (`--seg-1` to `--seg-6` in `base.css`, cycling), with the separators in grey. It is used by the generator and by the preview in the editor. The segments come from `BranchFormatter.formatSegments`.
- **Formats**: `FormatsView.vue` has the list (`FormatList.vue`) on one side and the detail on the other, and on narrow screens they are two steps. Built-in formats open read-only (`FormatReadonly.vue`), with a language selector and a button to clone them. Custom formats open in `FormatEditor.vue`. `FormatPreview.vue` shows the result, with an optional example to try; `FormatTemplateView.vue` draws a template with its tokens colored. The editor warns about tokens that match no field and fields that are not in the template (`src/core/FormatTemplate.ts`), without blocking the save.
- **Settings**: `SettingsView.vue` has `PersonalizationCard.vue` (language and theme, shared) and `BackupCard.vue` (export and import of the formats, with the result shown in the card).
- **`CustomSelect.vue`** / **`CustomModal.vue`**: Shared, themeable replacements for native `<select>` and confirm dialogs. The modals are only used to confirm a delete and to ask about discarding changes.
- **`LangSelector.vue`** / **`FlagIcon.vue`**: The UI language switcher.
- **`AppIcon.vue`**: The few icons the screens use.
- **`AppFooter.vue`**: Shows the app version (from `package.json`, injected at build time as `__APP_VERSION__`) linked to its GitHub release, plus license/source links.
- **Styles**: the tokens (including the accent color and the colors of the fields) are in `assets/base.css`, and the layout of the three screens in `assets/branch.css`. The accent color is only defined here, so the other portfolio tools keep their own.

### 3. Localization (`src/i18n`)
- One JSON file per supported language (`en`, `es`, `fr`, `de`, `it`, `pt`), loaded by `vue-i18n` in `index.ts`.
- Most UI strings are looked up with `$t('namespace.key')`. Built-in format names and field labels are stored as i18n keys (e.g. `formats.gitflow.name`) inside `FormatManager`'s data rather than literal text, so they follow the selected UI language; custom formats store literal text instead. Components that display a format's `name`/field `label` check for a `.` to decide whether to translate it or show it as-is (see `BranchForm.vue`, `FormatList.vue`, `FormatsView.vue`).

## Privacy & Data
No data ever leaves the user's browser. The app uses no external APIs, cookies, analytics or tracking services. Everything is stored in the browser's `localStorage`.

### Shared components

The header, footer, selects, settings card, icons and theme util are shared byte for byte with the other portfolio tools. What differs per app (repository and author) lives in `src/app.config.ts`. See [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).
