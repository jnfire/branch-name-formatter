# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/). The version
number lives in a single place, `package.json`, and is shown live in the app
footer.

## [Unreleased]

### Changed
- License changed from proprietary to the GNU Affero General Public
  License v3.0 (`AGPL-3.0-only`).
- Toolchain aligned with the other portfolio tools: vue-i18n 11, Vite 7,
  Vitest 4, TypeScript 5.9, ESLint 9 (flat config) and Prettier.
- CI now runs lint, format check, tests, type-check and build, and the
  GitHub Pages deploy only runs when all of them pass.
- `Footer.vue` renamed to `AppFooter.vue`; footer links point at the
  current repository name.

### Removed
- Google Analytics and the cookie-consent banner. The app uses no
  cookies, analytics or tracking.
- Unused `ArrowLeftIcon` component, orphaned `header.settings` strings in
  four locales, and the committed dev server log.

### Fixed
- `<html lang>` now follows the interface language.
- Export and Import buttons render at the same text size.
- vue-i18n security advisory (high) in `@intlify/core-base`.

## [1.0.0] - 2026-08-12

First stable release. This version is a full redesign of the app's visual
layer and a rework of the branch-format system, on top of the local-first,
no-registration foundation the app already had.

### Added
- Dynamic branch-format configuration screen: create, edit, clone, delete,
  and import/export custom formats, with a live preview of the result.
- Per-field capitalization control (uppercase / lowercase / as-is) and a
  per-format language profile that drives character sanitization (`ñ`, `ß`,
  `/`, accents...) consistently across the 6 supported UI languages
  (en, es, fr, de, it, pt).
- Explicit default-format selection with a visual indicator, and a
  visibility switch per format.
- Built-in formats can now have their visibility and sanitization language
  edited directly (their name, template, and fields stay locked — clone
  them to customize those).
- New reusable UI components: `CustomSelect`, `CustomModal`, and inline SVG
  icons for the leaf logo, settings, and back-arrow glyphs.
- Full responsive layout pass (mobile / tablet / desktop) across the whole
  app, including the new configuration screens.
- App version displayed in the footer, linking to the matching GitHub
  release.
- Full i18n coverage of the configuration screens and built-in format
  names/labels, which were previously hardcoded in Spanish regardless of
  the selected UI language.

### Changed
- Branch name sanitization is no longer an opt-in checklist: dot/space
  replacement, accent stripping, and special-character removal are always
  applied, so every generated name is a valid git branch name. Only
  capitalization remains configurable per field.
- Native checkboxes/selects in the format editor replaced by the custom,
  themeable components used across the rest of the app.
- Header, containers, and spacing reworked to a consistent breakpoint
  system instead of ad-hoc per-component media queries.

### Fixed
- Default-format preview no longer falls back to the first format in the
  list after canceling an edit or deleting a format — it correctly returns
  to the actual current default.
- Long branch-name previews wrap at hyphen boundaries instead of breaking
  mid-word.
- History list action buttons ("Copy" / "Delete") and the settings button
  now translate with the rest of the UI instead of always showing English
  text.
- Hidden formats can no longer become the app default by clicking their
  card in the list; they can still be previewed.

### Removed
- Emoji icons across the UI (inconsistent rendering on Windows/some
  browsers), replaced with inline SVG icons.

## [0.2.0] - 2026-05-01
### Added
- Custom `LangSelector` component with flag icons, replacing the native
  language `<select>`, with improved keyboard accessibility.
- Multi-language support groundwork (flag icons, badge terminology).

### Changed
- CI/deploy workflows updated to Node.js 22.

## [0.1.0] - 2025-10-09
### Added
- Full UI redesign unifying the visual style with the author's other
  local-first tools.
- Initial i18n support (English/Spanish) and a `docs/` folder documenting
  the project architecture.
- Opt-in Google Analytics with a cookie-consent banner.
- Responsive layout styles for mobile devices.

### Changed
- License changed from GPL-3.0 to proprietary.

## Initial development - 2024-04-21 to 2025-10-09
Pre-release history: the original branch-name generator (project ID +
ticket ID + feature name), branch history stored in `localStorage`, first
GitHub Pages deployment, and the groundwork later formalized as `Branch`,
`BranchManager`, and `BranchFormatter`.
