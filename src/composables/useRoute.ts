import { ref, readonly } from 'vue';

export type Route =
  { name: 'home' } | { name: 'formats'; formatId: string | null } | { name: 'settings' };

/** Turns `location.hash` into a route. Anything unknown is the generator. */
export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if (path === 'ajustes') return { name: 'settings' };
  if (path === 'formatos') return { name: 'formats', formatId: null };
  if (path.startsWith('formatos/')) {
    const id = decodeURIComponent(path.slice('formatos/'.length));
    return { name: 'formats', formatId: id || null };
  }
  return { name: 'home' };
}

export function routeToHash(route: Route): string {
  if (route.name === 'settings') return '#/ajustes';
  if (route.name === 'formats') {
    return route.formatId ? `#/formatos/${encodeURIComponent(route.formatId)}` : '#/formatos';
  }
  return '#/';
}

/**
 * A screen with changes that are not saved yet can register a guard. Moving
 * to another screen from inside the app then asks first. The browser's Back
 * button cannot be intercepted this way.
 */
export interface LeaveGuard {
  isDirty: () => boolean;
  ask: (proceed: () => void) => void;
}

const current = ref<Route>(
  typeof window === 'undefined' ? { name: 'home' } : parseRoute(window.location.hash),
);
let guard: LeaveGuard | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    current.value = parseRoute(window.location.hash);
  });
}

const go = (route: Route) => {
  const hash = routeToHash(route);
  if (window.location.hash === hash) {
    current.value = route;
    return;
  }
  window.location.hash = hash;
};

const navigate = (route: Route) => {
  if (guard?.isDirty()) {
    guard.ask(() => go(route));
    return;
  }
  go(route);
};

export function setLeaveGuard(next: LeaveGuard | null) {
  guard = next;
}

export function useRoute() {
  return {
    route: readonly(current),
    goHome: () => navigate({ name: 'home' }),
    goFormats: (formatId: string | null = null) => navigate({ name: 'formats', formatId }),
    goSettings: () => navigate({ name: 'settings' }),
  };
}
