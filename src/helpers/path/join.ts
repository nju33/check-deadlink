import * as path from 'path';
import {URL} from 'url';

export type JoinFn = (base: string, relative: string) => string;
export const join: JoinFn = (base, relative) => {
  const url = new URL(base)
  url.pathname = path.join(url.pathname, relative);

  return url.toString();
}
