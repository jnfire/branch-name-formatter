# Shared Design System

*Read this in [Spanish](DESIGN-SYSTEM-es.md).*

Desplaza, [Base64 to File](https://github.com/jnfire/base64-to-file) and [Branch Name Formatter](https://github.com/jnfire/branch-name-formatter) look and behave as one family. There is no shared package yet, so the common pieces are **copied byte for byte** into each repository and a script keeps the copies from drifting apart.

## What is shared

| File (in `src/`) | What it is |
| --- | --- |
| `components/AppHeader.vue` | App name, one-line description, optional share button and the settings toggle |
| `components/AppFooter.vue` | Facts line with the version, links to source and licence, optional methodology button, author credit |
| `components/CustomSelect.vue` | Accessible dropdown (keyboard navigation, focus return) |
| `components/LangSelector.vue` | The same dropdown with flags, for the interface language |
| `components/PersonalizationCard.vue` | Settings card with language and theme |
| `components/FlagIcon.vue`, `components/SettingsIcon.vue` | Icons |
| `utils/theme.ts` | Light, dark or system theme, saved on the device |

The list lives in `shared-components.json`, together with the SHA-256 of each file.

## What is not shared

- **`src/app.config.ts`** holds what differs between the apps: the repository and the author. The shared components read it instead of hard-coding names.
- **Translations.** Each app has its own dictionaries, but the shared components need a common set of keys (`header.*`, `footer.*`, `settings.*` and `shared.select_option`). A test in each repo checks that all six languages define them.
- **Global styles.** The design tokens and the form and settings classes live in each app's global CSS and must keep the same names and values.

## Design tokens

| Token | Light | Dark |
| --- | --- | --- |
| `--bg-body` | `#ffffff` | `#111827` |
| `--bg-surface` | `#f9fafb` | `#1f2937` |
| `--bg-surface-hover` | `#f3f4f6` | `#374151` |
| `--text-main` | `#111827` | `#f9fafb` |
| `--text-muted` | `#6b7280` | `#9ca3af` |
| `--border-color` | `#e5e7eb` | `#374151` |
| `--accent-color` | `#000000` | `#ffffff` |
| `--error-color` | `#ef4444` | `#f87171` |

Cards use `--bg-surface` over `--bg-body`, controls use `--bg-body`, and radii are 8 px for controls and 12 px for cards.

## Changing a shared component

1. Edit the file in one repository and run `npm run check:shared -- --update`.
2. Copy the changed files and `shared-components.json` to the other two repositories.
3. Run the tests in all three.

CI runs `npm run check:shared` on every pull request and before every deploy, so a copy that was edited alone fails the build.

## Towards a package

Once the shared set stops changing often, the same files can become a small package with an open licence (MIT, since it is a library and not an app) that the three apps and the portfolio site install, and `check:shared` disappears. Until then, copying keeps the tools independent and simple to deploy.
