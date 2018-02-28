import {normalize} from './normalize';

// tslint:disable no-http-string

describe('helpers.path.normalize', () => {
  test('With www. remaining', () => {
    expect(normalize('http://www.example.com'))
      .toBe('http://www.example.com');
  });

  test('Delete www.', () => {
    expect(normalize('http://www.example.com', {stripWWW: true}))
      .toBe('http://example.com');
  });

  test('Delete hash', () => {
    expect(normalize('http://example.com#foo'))
      .toBe('http://example.com');
  });

  test('Delete search', () => {
    expect(normalize('http://example.com/?foo&bar=bar'))
      .toBe('http://example.com');
  });

  test('Remove last slash', () => {
    expect(normalize('http://example.com/foo/'))
      .toBe('http://example.com/foo');
  });
});
