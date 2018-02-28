import {getLinks} from './get-links';

// tslint:disable no-http-string

describe('helpers.dom.getLinks', () => {
  test('get links from document.body', () => {
    const html = `
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="http://example.com/style.css">
  </head>
  <body>
    <a href="relative/path"></a>
    <a href="./relative2/path"></a>
    <a href="../relative3/path"></a>
    <a href="./relative-hash#a"></a>
    <a href="../relative-hash2/#aa"></a>
    <a href="./relative-search?a"></a>
    <a href="../relative-search2/?aa"></a>
    <a href="/absolute/path"></a>
    <a href="http://url.com"></a>
    <a href="https://ssl.com"></a>
    <a href="#"></a>
    <script src="http://example.com/script.js"></script>
  </body>
</html>
    `;

    const result = getLinks('http://test.com/foo', html);
    expect(result.length).toBe(11);
    expect(result)
      .toEqual(
        expect.arrayContaining([
          'http://test.com/foo/relative/path',
          'http://test.com/foo/relative2/path',
          'http://test.com/relative3/path',
          'http://test.com/foo/relative-hash#a',
          'http://test.com/relative-hash2/#aa',
          'http://test.com/foo/relative-search?a',
          'http://test.com/relative-search2/?aa',
          'http://test.com/absolute/path',
          'http://url.com',
          'https://ssl.com',
          'http://example.com/script.js',
        ])
      );
  });
});
