# check-deadlink

[![npm: check-deadlink](https://img.shields.io/npm/v/check-deadlink.svg)](https://www.npmjs.com/package/check-deadlink)
[![CircleCI](https://circleci.com/gh/nju33/check-deadlink.svg?style=svg&circle-token=a28ff5af8b1e0a0e3f4ec38d619681fc4886f63c)](https://circleci.com/gh/nju33/check-deadlink)
[![Coverage Status](https://coveralls.io/repos/github/nju33/check-deadlink/badge.svg?branch=master)](https://coveralls.io/github/nju33/check-deadlink?branch=master)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![license: mit](https://img.shields.io/packagist/l/doctrine/orm.svg)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

## Install

```bash
yarn add [-D] check-deadlink
```

## Example

```ts
const checkDeadlink = require('check-deadlink');

(async () => {
  const result = await checkDeadlink('https://example.com', {
    verbose: true
  });

  console.log(result);
})()
  .catch(err => {
    console.error(err);
  });

```
