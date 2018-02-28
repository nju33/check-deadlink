import {URL} from 'url';
import {JSDOM} from 'jsdom';
import getUrls = require('get-urls');
import {uniq} from 'lodash';
import * as ipath from '../ipath';

// correct
// foo
// foo/bar
// ./foo/bar
// ../foo/bar
// incorrect
// foo
// http://...
// #...
// ?...
export const isRelativeUrl = (href: string) => /^(?!http)[.\w]/.test(href);

export const isAbsoluteUrl = (href: string) => /^\//.test(href);

export type GetLinks<S = string> = (base: S, html: S) => S[];
export const getLinks = (base, html) => {
  const {document} = new JSDOM(html).window;

  const urls = [
    ...Array.from(getUrls(document.body.innerHTML, {
      stripWWW: false
    })),
    ...Array.from(document.getElementsByTagName('a')).map(aTag => {
      const href = aTag.getAttribute('href') as string;

      if (isRelativeUrl(href)) {
        return ipath.join(base, href);
      }

      if (isAbsoluteUrl(href)) {
        return new URL(href, base).toString();
      }

      return href;
    }).filter(url => {
      return !/^#/.test(url);
    }),
  ] as string[];

  return uniq(urls);
}
