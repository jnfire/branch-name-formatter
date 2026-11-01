import { describe, expect, it } from 'vitest';
import { parseRoute, routeToHash } from '../useRoute';

describe('parseRoute', () => {
  it.each([
    ['', { name: 'home' }],
    ['#/', { name: 'home' }],
    ['#/algo-raro', { name: 'home' }],
    ['#/ajustes', { name: 'settings' }],
    ['#/formatos', { name: 'formats', formatId: null }],
    ['#/formatos/', { name: 'formats', formatId: null }],
    ['#/formatos/custom-17', { name: 'formats', formatId: 'custom-17' }],
    ['#/formatos/a%20b', { name: 'formats', formatId: 'a b' }],
  ])('%s', (hash, expected) => {
    expect(parseRoute(hash)).toEqual(expected);
  });

  it('turns a route back into the same hash', () => {
    for (const hash of ['#/', '#/ajustes', '#/formatos', '#/formatos/custom-17']) {
      expect(routeToHash(parseRoute(hash))).toBe(hash);
    }
  });
});
