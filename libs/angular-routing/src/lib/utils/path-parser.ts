import { Route } from '../route';
import { Params } from '../route-params.service';

const PARAM_PREFIX = ':';

export interface RouteMatch {
  path: string;
  params: Params;
}

const DIV = '/'; // /
const DIV_PARAM = `(?:${DIV}([^\\/#\\?]+?))`; // capturing group for one or more of not (/, # or ?), optional (TODO: check if optional is needed)
const PATH_END = '[\\/#\\?]'; // path end: /, # or ?
const END = '[]|$'; // null or end
const EXACT_END = `${PATH_END}?$`; // match PATH_END optionally and END
const WILDCARD = `(?:${PATH_END}(?=${END}))?`; // match optionally PATH_END followed by END
const NON_EXACT_END = `${WILDCARD}(?=${PATH_END}|${END})`; // match WILDCARD followed by PATH_END or END

export function getPathSegments(route: Route): string[] {
  const sanitizedPath = route.path.replace(/^\//, '');
  return sanitizedPath ? sanitizedPath.split('/') : [];
}

export const parsePath = (route: Route): RegExp => {
  const segments = getPathSegments(route);
  const regexBody = segments.reduce(
    (acc, segment) =>
      segment.startsWith(PARAM_PREFIX)
        ? `${acc}${DIV_PARAM}`
        : `${acc}${DIV}${segment}`,
    ''
  );

  if (route.options.exact ?? true) {
    return new RegExp(`^${regexBody}${EXACT_END}`, 'i');
  } else {
    return new RegExp(
      `^${regexBody}${regexBody ? NON_EXACT_END : WILDCARD}`,
      'i'
    );
  }
};

export const matchRoute = (
  url: string,
  route: Route
): RouteMatch | undefined => {
  const match = route.matcher?.exec(url);
  if (!match) {
    return;
  }
  const keys = getPathSegments(route)
    .filter((s) => s.startsWith(PARAM_PREFIX))
    .map((s) => s.slice(1));

  return {
    path: match[0],
    params: keys.reduce(
      (acc, key, index) => ({ ...acc, [key]: match[index + 1] }),
      {}
    ),
  };
};
