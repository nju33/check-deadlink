import * as path from 'path';
import {URL, parse as urlParse} from 'url';

export type JoinFn<S = string> = (base: S, relative: S) => S;
export const join: JoinFn = (base, relative) => {
  const urlObject = new URL(base)
  const relativeObject = urlParse(relative);

  if (relativeObject.pathname !== undefined && relativeObject.pathname !== null) {
    urlObject.pathname = path.join(urlObject.pathname, relativeObject.pathname);
  }

  if (relativeObject.hash !== undefined && relativeObject.hash !== null) {
    urlObject.hash = relativeObject.hash;
  }

  if (relativeObject.search !== undefined && relativeObject.search !== null) {
    urlObject.search = relativeObject.search;
  }

  return urlObject.toString();
}
