# Roadmap

*Read this in [Spanish](ROADMAP-es.md).*

What Branch Name Formatter does today and where it could go. The ideas are ordered by how much they would help; they are ideas, not commitments or dates.

## What it does today

- Generate valid, consistent Git branch names from three built-in formats (app default, GitFlow, Conventional Commits).
- Create, clone, edit and delete your own formats, with a live preview; import and export them.
- Sanitization that always yields valid names, with a language profile per format (six languages).
- A history of the last ten names, kept on the device.

## Ideas

1. **Share a format by link,** without exchanging a JSON file.
2. **A maximum length per format,** for the limits of some Git hosts, with a sensible truncation.
3. **Copy as a command** (`git switch -c <name>`) next to copying the name.
4. **More built-in formats** for common issue trackers.
5. **Keyboard shortcuts** to generate and copy.
6. **Offline use** as an installable app (PWA).

## Out of scope

- Accounts, a backend or any storage on a server: everything stays in your browser.
- Advertising and tracking.
