import {URL} from 'url';
import {JSDOM} from 'jsdom';
// tslint:disable-next-line no-unused
import {groupBy, uniq, difference, Dictionary} from 'lodash';
import got = require('got');
import getUrls = require('get-urls');
import delay = require('delay');

declare namespace checkDeadlink {
  export interface Result {
    status: number;
    url: string;
    parentUrl?: string;
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
  parentUrl?: string,
  config: checkDeadlink.Config = {...defaultConfig},
  data: checkDeadlink.Data = initialData,
  deep: number = 1
) => {
  const flattenUrl = url.replace('www.', '');
  if (data.baseUrl === undefined) {
    data.baseUrl = flattenUrl;
  }

  try {
    const res = await got(url, {
      timeout: 8000
    });
    data.result[url] = {
      status: res.statusCode as number,
      url,
      parentUrl
    };

    if (flattenUrl.startsWith(data.baseUrl)) {
      const doc = new JSDOM(res.body).window.document;
      const html = doc.body.innerHTML;
      const urls = difference(
        uniq([
          ...Array.from<string>(getUrls(html)).filter(
            thisUrl => !checked(thisUrl, data)
          ),
          ...Array.from(doc.getElementsByTagName('a')).map(a => {
            const href = a.getAttribute('href') as string;

            return new URL(href, url).toString();
          })
        ]),
        Object.keys(data.result)
      );

      // for (const thisUrl of urls) {
      await Promise.all(
        urls.map(async (thisUrl, i) => {
          if (deep + 1 > config.deep) {
            return;
          }

          await delay(i * 15);
          const currentUrl = new URL(thisUrl);
          currentUrl.hash = '';
          currentUrl.search = '';

          if (data.result[currentUrl.toString()] !== undefined) {
            return;
          }

          if (data.result[currentUrl.toString()] === undefined) {
            data.result[currentUrl.toString()] = {};
          }

          if (config.verbose) {
            console.log(currentUrl.toString())
          }

          await checkDeadlink(
            thisUrl,
            currentUrl.toString(),
            config,
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
        parentUrl
      };

      return;
    }

    data.result[url] = {
      status: res.statusCode as number,
      url,
      parentUrl
    };

    return;
  }

  const groupedByParentUrl = groupBy(data.result, 'parentUrl');
  Object.keys(groupedByParentUrl).forEach(thisUrl => {
    const deadlinks = (groupedByParentUrl[thisUrl] as checkDeadlink.Result[]).filter(result => {
      return result.status === 404 || result.status === 500;
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
