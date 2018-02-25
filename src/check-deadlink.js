var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { URL } from 'url';
import { JSDOM } from 'jsdom';
import { groupBy, uniq, difference } from 'lodash';
const defaultConfig = {
    deep: 5,
    verbose: false
};
const initialData = {
    result: {}
};
const checked = (url, data) => {
    return Object.keys(data.result).includes(url);
};
const checkDeadlink = (url, parentUrl, config = Object.assign({}, defaultConfig), data = initialData, deep = 1) => __awaiter(this, void 0, void 0, function* () {
    const flattenUrl = url.replace('www.', '');
    if (data.baseUrl === undefined) {
        data.baseUrl = flattenUrl;
    }
    try {
        const res = yield got(url, {
            timeout: 8000
        });
        data.result[url] = {
            status: res.statusCode,
            url,
            parentUrl
        };
        if (flattenUrl.startsWith(data.baseUrl)) {
            const doc = new JSDOM(res.body).window.document;
            const html = doc.body.innerHTML;
            const urls = difference(uniq([
                ...Array.from(getUrls(html)).filter(thisUrl => !checked(thisUrl, data)),
                ...Array.from(doc.getElementsByTagName('a')).map(a => {
                    const href = a.getAttribute('href');
                    return new URL(href, url).toString();
                })
            ]), Object.keys(data.result));
            // for (const thisUrl of urls) {
            yield Promise.all(urls.map((thisUrl, i) => __awaiter(this, void 0, void 0, function* () {
                if (deep + 1 > config.deep) {
                    return;
                }
                yield delay(i * 15);
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
                    console.log(currentUrl.toString());
                }
                yield checkDeadlink(thisUrl, currentUrl.toString(), config, data, deep + 1);
            })));
        }
    }
    catch (err) {
        const res = err.response;
        if (res === undefined) {
            data.result[url] = {
                status: -1,
                url,
                parentUrl
            };
            return;
        }
        data.result[url] = {
            status: res.statusCode,
            url,
            parentUrl
        };
        return;
    }
    const groupedByParentUrl = groupBy(data.result, 'parentUrl');
    Object.keys(groupedByParentUrl).forEach(thisUrl => {
        const deadlinks = groupedByParentUrl[thisUrl].filter(result => {
            return result.status === 404 || result.status === 500;
        });
        if (deadlinks.length === 0) {
            delete groupedByParentUrl[thisUrl];
            return;
        }
        groupedByParentUrl[thisUrl] = deadlinks;
    });
    return groupedByParentUrl;
});
//# sourceMappingURL=check-deadlink.js.map