import { Route } from '../route';
import { compareRoutes } from './compare-routes';
import { parsePath } from './path-parser';

describe('compareRoutes', () => {
  it('should return 0 if matchers are same', () => {
    const a = makeRoute({ path: '/', options: {} });
    const b = makeRoute({ path: '/', options: { exact: true } });
    expect(compareRoutes(a, b)).toEqual(0);
  });

  it('should ignore names of params when comparing', () => {
    const a = makeRoute({ path: '/:user', options: {} });
    const b = makeRoute({ path: '/:person', options: {} });
    expect(compareRoutes(a, b)).toEqual(0);
  });

  it('should prioritize root route over wildcard route', () => {
    const a = makeRoute({ path: '/', options: { exact: false } });
    const b = makeRoute({ path: '', options: {} });

    expect(compareRoutes(a, b)).toEqual(1);
  });

  it('should prioritize non-empty path over empty', () => {
    const a = makeRoute({ path: '/', options: { exact: true } });
    const b = makeRoute({ path: 'test', options: {} });

    expect(compareRoutes(a, b)).toEqual(1);
  });

  it('should prioritize exact route over non-exact', () => {
    const a = makeRoute({ path: 'test', options: {} });
    const b = makeRoute({ path: 'test', options: { exact: false } });

    expect(compareRoutes(a, b)).toEqual(-1);
  });

  it('should prioritize static over parametrized paths', () => {
    const a = makeRoute({ path: '/test/:param', options: {} });
    const b = makeRoute({ path: '/test/static', options: {} });
    const c = makeRoute({ path: '/:param/test', options: {} });

    expect(compareRoutes(a, b)).toEqual(1);
    expect(compareRoutes(a, c)).toEqual(-1);
    expect(compareRoutes(b, c)).toEqual(-1);
  });
  it('should prioritize longer paths', () => {
    const a = makeRoute({ path: '/test/:param', options: { exact: true } });
    const b = makeRoute({ path: '/test/:param/user/:id', options: {} });
    const c = makeRoute({
      path: '/test/:param/user',
      options: { exact: true },
    });

    expect(compareRoutes(a, b)).toEqual(1);
    expect(compareRoutes(a, c)).toEqual(1);
    expect(compareRoutes(b, c)).toEqual(-1);
  });
});

function makeRoute(route: Route): Route {
  route.matcher = parsePath(route);
  return route;
}
