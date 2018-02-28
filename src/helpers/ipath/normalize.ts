import {URL} from 'url';

export interface Options {
  stripWWW?: boolean ;
}
const defaultOptions: Options = {
  stripWWW: false
}

export type Normalize<S = string> = (url: S, options?: Options) => S;
export const normalize: Normalize = (url, userOptions = {}) => {
  const options = {defaultOptions, ...userOptions};
  const urlObject = new URL(url);

  if (options.stripWWW && /https?:\/\/www\..+\..+/.test(urlObject.origin)) {
    urlObject.href = urlObject.origin.replace('www.', '');
  }

  urlObject.search = '';
  urlObject.hash = '';

  if (urlObject.pathname === '/') {
    return urlObject.origin;
  }

  urlObject.pathname = /\/$/.test(urlObject.pathname)
    ? urlObject.pathname.slice(0, -1)
    : urlObject.pathname;

  return urlObject.toString();
};
