import { Location, PlatformLocation } from '@angular/common';

import { Router } from './router.service';
import { UrlParser } from './url-parser';

describe('Router', () => {
  let router: Router;
  let location: Location;
  let platformLocation: PlatformLocation;
  let urlParser: UrlParser;
  const path = '/next';

  beforeEach(() => {
    location = ({
      path: jest.fn().mockReturnValue('/path'),
      go: jest.fn(),
      subscribe: (cb: Function) => {
        cb();
      },
      prepareExternalUrl: jest.fn().mockImplementation((url: string) => url),
      replaceState: jest.fn(),
      normalize: jest.fn().mockImplementation((path: string) => path),
    } as unknown) as Location;

    platformLocation = ({
      href: 'http://localhost/path',
    } as unknown) as PlatformLocation;

    urlParser = new UrlParser();

    router = new Router(location, platformLocation, urlParser);
  });

  describe('go', () => {
    it('should delegate to the Location.go method', () => {
      (platformLocation as any).href = getHref(path);

      router.go(path);

      expect(location.go).toHaveBeenCalledWith(path);
    });

    it('should handle query params', () => {
      router.go(path, { debug: 1 });

      expect(location.go).toHaveBeenCalledWith(`${path}?debug=1`);
    });

    it('should handle query params', () => {
      (platformLocation as any).href = getHref(`${path}?debug=1`);

      router.go(path, { debug: 1 });

      expect(location.go).toHaveBeenCalledWith(`${path}?debug=1`);
    });

    it('should handle a fragment', () => {
      (platformLocation as any).href = getHref(`${path}#anchor`);

      router.go(path, undefined, 'anchor');

      expect(location.go).toHaveBeenCalledWith(`${path}#anchor`);
    });

    it('should handle query params and a fragment combined', () => {
      router.go(path, { debug: 1 }, 'anchor');

      expect(location.go).toHaveBeenCalledWith(`${path}?debug=1#anchor`);
    });
  });

  describe('replace', () => {
    it('should delegate to the Location.replaceState method', () => {
      (platformLocation as any).href = getHref(path);

      router.replace(path);

      expect(location.replaceState).toHaveBeenCalledWith(path);
    });

    it('should handle query params', () => {
      router.replace(path, { debug: 1 });

      expect(location.replaceState).toHaveBeenCalledWith(`${path}?debug=1`);
    });

    it('should handle query params', () => {
      router.replace(path, { debug: 1 });

      expect(location.replaceState).toHaveBeenCalledWith(`${path}?debug=1`);
    });

    it('should handle a fragment', () => {
      router.replace(path, undefined, 'anchor');

      expect(location.replaceState).toHaveBeenCalledWith(`${path}#anchor`);
    });

    it('should handle query params and a fragment combined', () => {
      router.replace(path, { debug: 1 }, 'anchor');

      expect(location.replaceState).toHaveBeenCalledWith(
        `${path}?debug=1#anchor`
      );
    });
  });

  describe('serializeUrl', () => {
    it('should handle absolute paths', () => {
      const url = router.serializeUrl(path);

      expect(url).toBe(path);
    });

    it('should handle relative paths', () => {
      const url = router.serializeUrl('next');

      expect(url).toBe('/path/next');
    });

    it('should handle relative paths with backtracking', () => {
      const url = router.serializeUrl('../next');

      expect(url).toBe(path);
    });

    it('should handle query params', () => {
      const url = router.serializeUrl(path, { debug: 1 });

      expect(url).toBe(`${path}?debug=1`);
    });

    it('should handle a fragment', () => {
      const url = router.serializeUrl(path, undefined, 'anchor');

      expect(url).toBe(`${path}#anchor`);
    });

    it('should handle query params and a fragment combined', () => {
      const url = router.serializeUrl(path, { debug: 1 }, 'anchor');

      expect(url).toBe(`${path}?debug=1#anchor`);
    });
  });

  describe('getExternalUrl', () => {
    it('should delegate to the Location.prepareExternalUrl method', () => {
      const url = router.getExternalUrl(path);

      expect(url).toBe(path);
      expect(location.prepareExternalUrl).toHaveBeenCalledWith(path);
    });
  });

  describe('normalizePath', () => {
    it('should delegate to the Location.normalize method', () => {
      const url = router.normalizePath(path);

      expect(url).toBe(path);

      expect(location.normalize).toHaveBeenCalledWith(path);
    });
  });

  describe('url$', () => {
    it('should reflect the current path', (done) => {
      router.url$.subscribe((url) => {
        expect(url).toBe(location.path());
        done();
      });
    });

    it('should reflect an updated path', (done) => {
      const next = 'new';
      (platformLocation as any).href = getHref(next);

      router.go('/new');

      router.url$.subscribe((url) => {
        expect(url).toBe(`/${next}`);
        done();
      });
    });
  });

  describe('hash$', () => {
    it('should reflect the current hash', (done) => {
      router.hash$.subscribe((url) => {
        expect(url).toBe('');
        done();
      });
    });

    it('should reflect an updated hash', (done) => {
      const next = 'new#anchor';
      (platformLocation as any).href = getHref(next);

      router.go('/new', undefined, 'anchor');

      router.hash$.subscribe((hash) => {
        expect(hash).toBe('anchor');
        done();
      });
    });
  });

  describe('queryParams$', () => {
    it('should reflect the current query params', (done) => {
      router.queryParams$.subscribe((queryParams) => {
        expect(queryParams).toEqual({});
        done();
      });
    });

    it('should reflect updated query params', (done) => {
      const next = 'new?debug=1';
      (platformLocation as any).href = getHref(next);

      router.go('/new', { debug: 1 });

      router.queryParams$.subscribe((queryParams) => {
        expect(queryParams).toEqual({ debug: '1' });
        done();
      });
    });
  });

  function getHref(path: string) {
    return `http://localhost/${path}`;
  }
});
