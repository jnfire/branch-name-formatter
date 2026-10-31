import { describe, expect, it } from 'vitest';
import en from '../en.json';
import es from '../es.json';
import fr from '../fr.json';
import de from '../de.json';
import it_ from '../it.json';
import pt from '../pt.json';

type Messages = { [key: string]: string | Messages };

const flattenKeys = (messages: Messages, prefix = ''): string[] =>
  Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [path] : flattenKeys(value, path);
  });

const locales: Record<string, Messages> = { es, fr, de, it: it_, pt };
const referenceKeys = flattenKeys(en).sort();

describe('i18n dictionaries', () => {
  it.each(Object.keys(locales))('%s has exactly the same keys as en', (locale) => {
    expect(flattenKeys(locales[locale]).sort()).toEqual(referenceKeys);
  });

  it.each(Object.keys({ en, ...locales }))('%s has no empty strings', (locale) => {
    const messages = locale === 'en' ? en : locales[locale];
    const emptyKeys = flattenKeys(messages).filter((path) => {
      const value = path
        .split('.')
        .reduce<string | Messages>((node, key) => (node as Messages)[key], messages);
      return typeof value === 'string' && value.trim() === '';
    });
    expect(emptyKeys).toEqual([]);
  });
});
