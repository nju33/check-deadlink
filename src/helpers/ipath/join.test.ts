import {join} from './join';

// tslint:disable no-http-string

describe('helpers.path.join', () => {
  test('Join paths of url', () => {
    expect(join('http://foo.com/bar', 'baz'))
      .toBe('http://foo.com/bar/baz');
  })
});
