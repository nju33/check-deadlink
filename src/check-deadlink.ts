import * as nodeUrl from 'url';
// import {JSDOM} from 'jsdom';
import {Padex} from '/Users/nju33/github/page-line/src/padex';
// tslint:disable-next-line no-unused
import {groupBy, uniq, difference, Dictionary} from 'lodash';
import got = require('got');
// import delay = require('delay');
// import * as dom from './helpers/dom';
// import * as ipath from './helpers/ipath';

declare namespace checkDeadlink {
  export interface Result {
    url: string;
    parentUrl?: string;
    response: got.Response<string>;
    readonly status: number;
  }

  export interface Error {
    url: string;
    parentUrl?: string;
    error: got.GotError;
    readonly status: -1;
  }

  export interface Config {
    deep: number;
    verbose: boolean;
  }

  export interface Data {
    result: {
      [url: string]: Result | Error;
    };
    baseUrl?: string;
  }
}

// const defaultConfig = {
//   deep: 5,
//   verbose: false
// };
//
// const initialData: checkDeadlink.Data = {
//   result: {}
// };
//
// const checked: (url: string, data: checkDeadlink.Data) => boolean = (
//   url,
//   data
// ) => {
//   return Object.keys(data.result).includes(url);
// };

const checkDeadlink = async (url: string) => {
  const padex = new Padex(url, {
    head: false,
    sleep: 1000,
    deep: 2,
    validate({url: aa, prevUrl}) {
      console.log('prevUrl', prevUrl);

      if (prevUrl === undefined) {
        return true;
      }

      // if (prevUrl === undefined) {
      //   return true;
      // }
      const hostname = nodeUrl.parse(prevUrl).hostname;
      if (hostname === undefined) {
        return false;
      }

      // console.log('hostname', '===============');
      // console.log(hostname, hostname === 'www.geek.co.jp');

      return hostname === 'www.geek.co.jp';
    }

  });

  const result = await padex.process();

  debugger;
  // const a: any = result.root.children
  //   .filter(d => d.response)
  //   .filter(res => (res as any).statusCode)

  const err = a.documents.filter(document => {

    console.log(document.children);

    const errorDocuments = (document.children || [])
      .filter(child => child.error);

    return errorDocuments.length > 0;
  });

  console.log(err)


  return result;

  // const normalizedUrl = ipath.normalize(url);
  // if (data.baseUrl === undefined) {
  //   data.baseUrl = normalizedUrl;
  // }
  //
  // if (config.verbose) {
  //   if (parentUrl === undefined) {
  //     console.log(normalizedUrl);
  //   } else {
  //     console.log(parentUrl, ' -> ', normalizedUrl);
  //   }
  // }
  //
  // try {
  //   const res = await got(url, {timeout: 20000});
  //   data.result[url] = {
  //     url,
  //     parentUrl,
  //     response: res,
  //     get status() {
  //       return (this as checkDeadlink.Result).response.statusCode as number;
  //     }
  //   };
  //
  //   if (normalizedUrl.startsWith(data.baseUrl)) {
  //     const doc = new JSDOM(res.body).window.document;
  //     const html = doc.body.innerHTML;
  //     const urls = dom
  //       .getLinks(normalizedUrl, html)
  //       .filter(thisUrl => !checked(thisUrl, data));
  //
  //     await Promise.all(
  //       urls.map(async (thisUrl, i) => {
  //         const normalizedThisUrl = ipath.normalize(thisUrl);
  //
  //         if (normalizedUrl === normalizedThisUrl || deep + 1 > config.deep) {
  //           return;
  //         }
  //
  //         await delay(i * 15);
  //
  //         if (data.result[normalizedThisUrl] !== undefined) {
  //           return;
  //         }
  //
  //         /**
  //          * レスポンスが来る前に再度同じURLで実行されない為に
  //          * とりあえず undefined 以外の値を入れる
  //          */
  //         if (data.result[normalizedThisUrl] === undefined) {
  //           data.result[normalizedThisUrl] = {} as any;
  //         }
  //
  //         await checkDeadlink(
  //           normalizedThisUrl,
  //           config,
  //           normalizedUrl,
  //           data,
  //           deep + 1
  //         );
  //       })
  //     );
  //   }
  // } catch (err) {
  //   const res: got.Response<string> | undefined = err.response;
  //   if (res === undefined) {
  //     data.result[url] = {
  //       url,
  //       parentUrl,
  //       error: err,
  //       get status() {
  //         return -1 as -1;
  //       }
  //     };
  //   } else {
  //     data.result[url] = {
  //       url,
  //       parentUrl,
  //       error: err,
  //       get status() {
  //         return -1 as -1;
  //       }
  //     };
  //   }
  //
  //   return;
  // }
  //
  // const groupedByParentUrl = groupBy(data.result, 'parentUrl');
  // Object.keys(groupedByParentUrl).forEach(thisUrl => {
  //   const deadlinks = (groupedByParentUrl[
  //     thisUrl
  //   ] as checkDeadlink.Result[]).filter(result => {
  //     return (
  //       result.status === -1 ||
  //       result.status === 403 ||
  //       result.status === 404 ||
  //       result.status === 500 ||
  //       result.status === 503
  //     );
  //   });
  //
  //   if (deadlinks.length === 0) {
  //     delete groupedByParentUrl[thisUrl];
  //
  //     return;
  //   }
  //
  //   groupedByParentUrl[thisUrl] = deadlinks;
  // });
  //
  // return groupedByParentUrl;
};

export = checkDeadlink;
