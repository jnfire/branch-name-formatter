#!/usr/bin/env node
/**
 * Guards the components shared by the portfolio tools (base64-to-file,
 * branch-name-formatter and desplaza).
 *
 * Each file listed in shared-components.json must be byte-identical in the
 * three repositories. This script compares the files in this repository with
 * the hashes in the manifest, so an edit to one copy cannot slip in unnoticed.
 *
 *   node scripts/check-shared.mjs            verify (used by CI)
 *   node scripts/check-shared.mjs --update   rewrite the manifest after an
 *                                            intentional change; then copy the
 *                                            files and the manifest to the
 *                                            other two repositories
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'shared-components.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

// Line endings are normalised so the hash does not depend on the operating system.
const hashOf = (file) =>
  createHash('sha256')
    .update(readFileSync(join(root, 'src', file), 'utf-8').replace(/\r\n/g, '\n'))
    .digest('hex');

const files = Object.keys(manifest.files).sort();

if (process.argv.includes('--update')) {
  manifest.files = Object.fromEntries(files.map((file) => [file, hashOf(file)]));
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Updated ${files.length} hashes in shared-components.json.`);
  process.exit(0);
}

const changed = files.filter((file) => hashOf(file) !== manifest.files[file]);
if (changed.length > 0) {
  console.error('These shared components differ from the shared version:');
  changed.forEach((file) => console.error(`  src/${file}`));
  console.error(
    '\nThey are shared with the other portfolio tools (see docs/DESIGN-SYSTEM.md).\n' +
      'If the change is intentional, run "npm run check:shared -- --update", then copy the\n' +
      'changed files and shared-components.json to the other repositories.',
  );
  process.exit(1);
}
console.log(`Shared components are in sync (${files.length} files).`);
