import got = require('got');
import getUrls = require('get-urls');

interface Result {
  status: number;
  url: string;
}

interface Data {
  result: {
    [url: string]: Result;
  };
  initial: boolean;
}

const initialData: Data = {
  result: {},
  initial: true,
};

const checked: (url: string, data: Data) => boolean = (url, data) => {
  return Object.keys(data.result).includes(url);
}

const checkDeadlink = async (url: string, data: Data = initialData) => {
  try {
    const res = await got(url);
    data.result.url = {
      status: res.statusCode as number,
      url
    };

    const urls = Array.from<string>(getUrls(res.body)).filter(thisUrl => !checked(thisUrl, data));
    console.log(urls);

    // await Promise.all(urls.map(async thisUrl => {
    //   return checkDeadlink(thisUrl, data);
    // }));
  } catch (err) {
    if (data.initial) {
      throw new Error(err);
    }

    const res: got.Response<string> = err.response;

    data.initial = false;
    data.result.url = {
      status: res.statusCode as number,
      url
    };
  }
};

export = checkDeadlink;
