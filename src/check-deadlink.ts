import {JSDOM} from 'jsdom';
// tslint:disable-next-line no-unused
import {groupBy, uniq, difference, Dictionary} from 'lodash';
import got = require('got');
import delay = require('delay');
import * as dom from './helpers/dom';
import * as ipath from './helpers/ipath';

declare namespace checkDeadlink {
  export interface Result {
    status: number;
    url: string;
    parentUrl?: string;
    error?: got.GotError
  }

  export interface Config {
    deep: number;
    verbose: boolean;
  }

  export interface Data {
    result: {
      [url: string]: Result | {};
    };
    baseUrl?: string;
  }
}

const defaultConfig = {
  deep: 5,
  verbose: false
};


const initialData: checkDeadlink.Data = {
  result: {}
};

const checked: (url: string, data: checkDeadlink.Data) => boolean = (url, data) => {
  return Object.keys(data.result).includes(url);
};

const checkDeadlink = async (
  url: string,
  config: checkDeadlink.Config = {...defaultConfig},
  parentUrl?: string,
  data: checkDeadlink.Data = initialData,
  deep: number = 1
) => {
  const normalizedUrl = ipath.normalize(url);
  if (data.baseUrl === undefined) {
    data.baseUrl = normalizedUrl
  }

  if (config.verbose) {
    if (parentUrl === undefined) {
      console.log(normalizedUrl);
    } else {
      console.log(parentUrl, ' -> ', normalizedUrl);
    }
  }

  try {
    const res = await got(url, {timeout: 20000});
    data.result[url] = {
      status: res.statusCode as number,
      url,
      parentUrl
    };

    if (normalizedUrl.startsWith(data.baseUrl)) {
      const doc = new JSDOM(res.body).window.document;
      const html = doc.body.innerHTML;
      const urls = dom.getLinks(normalizedUrl, html)
        .filter(thisUrl => !checked(thisUrl, data));

      await Promise.all(
        urls.map(async (thisUrl, i) => {
          const normalizedThisUrl = ipath.normalize(thisUrl);

          if (normalizedUrl === normalizedThisUrl || deep + 1 > config.deep) {
            return;
          }

          await delay(i * 15);

          if (data.result[normalizedThisUrl] !== undefined) {
            return;
          }

          if (data.result[normalizedThisUrl] === undefined) {
            data.result[normalizedThisUrl] = {};
          }

          await checkDeadlink(
            normalizedThisUrl,
            config,
            normalizedUrl,
            data,
            deep + 1
          );
        })
      );
    }
  } catch (err) {
    const res: got.Response<string> | undefined = err.response;
    if (res === undefined) {
      data.result[url] = {
        status: -1,
        url,
        parentUrl,
        error: err,
      };

      return;
    }

    data.result[url] = {
      status: res.statusCode as number,
      url,
      parentUrl,
      error: err
    };

    return;
  }

  const groupedByParentUrl = groupBy(data.result, 'parentUrl');
  Object.keys(groupedByParentUrl).forEach(thisUrl => {
    const deadlinks = (groupedByParentUrl[thisUrl] as checkDeadlink.Result[]).filter(result => {
      return result.status === -1 || result.status === 404 || result.status === 500;
    });

    if (deadlinks.length === 0) {
      delete groupedByParentUrl[thisUrl];

      return;
    }

    groupedByParentUrl[thisUrl] = deadlinks;
  });

  return groupedByParentUrl;
};

export = checkDeadlink;
