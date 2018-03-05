import * as path from 'path';
import serve = require('serve');
import delay = require('delay');
import checkDeadlink = require('./check-deadlink');

describe('Document', () => {
  // @ts-ignore
  let server: any;

  beforeAll(async () => {
    jest.setTimeout(100000);
    server = serve(path.resolve(__dirname, '../e2e'), {
      port: 5101
    });
    await delay(5000);
  });

  afterAll(async () => {
    if (server !== undefined) {
      server.stop();
    }
  });

  test('check deadlink', async () => {
    // tslint:disable-next-line no-http-string
    const result = await checkDeadlink('http://localhost:5101');
    const urls = Object.keys(result);

    expect(urls).toEqual(
      // tslint:disable-next-line no-http-string
      expect.arrayContaining(['http://localhost:5101/error.html'])
    );

    expect(urls).not.toEqual(
      // tslint:disable-next-line no-http-string
      expect.arrayContaining(['http://localhost:5101/success.html'])
    );
  });
});
