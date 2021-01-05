import { Route } from '../route';
import { getPathSegments } from './path-parser';

/**
 * Compares two routes and returns sorting number
 * 0 - equal
 * -1 - `a` has priority over `b`
 * 1 - `b` has priority over `a`
 *
 * @param a Route
 * @param b Route
 */
export const compareRoutes = (a: Route, b: Route): number => {
  // as matchers combine normalized path and `exact` option it's safe to compare regexps
  if (a.matcher.toString() === b.matcher.toString()) {
    return 0;
  }
  const aSegments = getPathSegments(a);
  const bSegments = getPathSegments(b);

  for (let i = 0; i < Math.max(aSegments.length, bSegments.length); i++) {
    const current = compareSegments(aSegments, bSegments, i);
    if (current) {
      return current;
    }
  }
  // when paths are same, exact has priority
  return a.options.exact ?? true ? -1 : 1;
};

function compareSegments(
  aSegments: string[],
  bSegments: string[],
  index: number
): number {
  // if a has no more segments -> return 1
  if (aSegments.length <= index) {
    return 1;
  }
  // if b has no more segments -> return -1
  if (bSegments.length <= index) {
    return -1;
  }
  if (aSegments[index] === bSegments[index]) {
    return 0;
  }
  // prioritize non-empty path over empty
  if (!aSegments[index]) {
    return 1;
  }
  if (!bSegments[index]) {
    return -1;
  }
  // ignore param names
  if (isParam(aSegments[index]) && isParam(bSegments[index])) {
    return 0;
  }
  // static segment has priority over param
  if (isParam(aSegments[index])) {
    return 1;
  }
  if (isParam(bSegments[index])) {
    return -1;
  }
  // when all is same run string comparison
  return aSegments[index].localeCompare(bSegments[index]);
}

function isParam(segment: string): boolean {
  return segment.startsWith(':');
}
