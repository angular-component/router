import { Route } from '../route';
import { matchRoute, parsePath } from './path-parser';

describe('parsePath', () => {
  it('should parse empty route', () => {
    expect(parsePath({ path: '', options: {} })).toEqual(/^[\/#\?]?$/i);
    expect(parsePath({ path: '/', options: {} })).toEqual(/^[\/#\?]?$/i);
  });
  it('should parse empty wildcard route', () => {
    expect(parsePath({ path: '', options: { exact: false } })).toEqual(
      /^(?:[\/#\?](?=[]|$))?/i
    );
    expect(parsePath({ path: '/', options: { exact: false } })).toEqual(
      /^(?:[\/#\?](?=[]|$))?/i
    );
  });
  it('should parse static route', () => {
    expect(parsePath({ path: 'first/second', options: {} })).toEqual(
      /^\/first\/second[\/#\?]?$/i
    );
    expect(parsePath({ path: '/first/second', options: {} })).toEqual(
      /^\/first\/second[\/#\?]?$/i
    );
  });
  it('should remove ending slash', () => {
    expect(parsePath({ path: 'first/', options: {} })).toEqual(
      /^\/first[\/#\?]?$/i
    );
    expect(parsePath({ path: '/first/', options: {} })).toEqual(
      /^\/first[\/#\?]?$/i
    );
  });
  it('should parse static wildcard route', () => {
    expect(
      parsePath({ path: 'first/second', options: { exact: false } })
    ).toEqual(/^\/first\/second(?:[\/#\?](?=[]|$))?(?=[\/#\?]|[]|$)/i);
    expect(
      parsePath({ path: '/first/second', options: { exact: false } })
    ).toEqual(/^\/first\/second(?:[\/#\?](?=[]|$))?(?=[\/#\?]|[]|$)/i);
  });

  it('should parse dynamic route', () => {
    expect(parsePath({ path: ':id', options: {} })).toEqual(
      /^(?:\/([^\/#\?]+?))[\/#\?]?$/i
    );
    expect(parsePath({ path: '/books/:bookId', options: {} })).toEqual(
      /^\/books(?:\/([^\/#\?]+?))[\/#\?]?$/i
    );
  });

  it('should parse dynamic wildcard route', () => {
    expect(parsePath({ path: ':id', options: { exact: false } })).toEqual(
      /^(?:\/([^\/#\?]+?))(?:[\/#\?](?=[]|$))?(?=[\/#\?]|[]|$)/i
    );
    expect(
      parsePath({ path: '/books/:bookId', options: { exact: false } })
    ).toEqual(
      /^\/books(?:\/([^\/#\?]+?))(?:[\/#\?](?=[]|$))?(?=[\/#\?]|[]|$)/i
    );
  });
});

describe('matchRoute', () => {
  it('should match wildcard route', () => {
    const route: Route = { path: '', options: { exact: false } };
    route.matcher = parsePath(route);

    expect(matchRoute('/', route)).toEqual({ path: '/', params: {} });
    expect(matchRoute('/first', route)).toEqual({ path: '', params: {} });
    expect(matchRoute('/first/second/third', route)).toEqual({
      path: '',
      params: {},
    });
  });
  it('should match empty route', () => {
    const route: Route = { path: '', options: {} };
    route.matcher = parsePath(route);

    expect(matchRoute('/', route)).toEqual({ path: '/', params: {} });
    expect(matchRoute('/first', route)).not.toBeDefined();
    expect(matchRoute('/first/second', route)).not.toBeDefined();
  });
  it('should match static wildcard route', () => {
    const route: Route = { path: 'first/second', options: { exact: false } };
    route.matcher = parsePath(route);

    expect(matchRoute('/first/second', route)).toEqual({
      path: '/first/second',
      params: {},
    });
    expect(matchRoute('/first', route)).not.toBeDefined();
    expect(matchRoute('/first/second/third', route)).toEqual({
      path: '/first/second',
      params: {},
    });
  });
  it('should match static route', () => {
    const route: Route = { path: 'first/second', options: {} };
    route.matcher = parsePath(route);

    expect(matchRoute('/first/second', route)).toEqual({
      path: '/first/second',
      params: {},
    });
    expect(matchRoute('/first', route)).not.toBeDefined();
    expect(matchRoute('/first/second/third', route)).not.toBeDefined();
  });
  it('should match dynamic wildcard route', () => {
    const route: Route = { path: 'first/:id', options: { exact: false } };
    route.matcher = parsePath(route);

    expect(matchRoute('/first/second', route)).toEqual({
      path: '/first/second',
      params: { id: 'second' },
    });
    expect(matchRoute('/first', route)).not.toBeDefined();
    expect(matchRoute('/first/second/third', route)).toEqual({
      path: '/first/second',
      params: { id: 'second' },
    });
  });
  it('should match dynamic route', () => {
    const route: Route = { path: 'first/:id/:name', options: {} };
    route.matcher = parsePath(route);

    expect(matchRoute('/first/second', route)).not.toBeDefined();
    expect(matchRoute('/first', route)).not.toBeDefined();
    expect(matchRoute('/first/second/third', route)).toEqual({
      path: '/first/second/third',
      params: { id: 'second', name: 'third' },
    });
  });
});
