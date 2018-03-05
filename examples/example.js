require('ts-node/register');
const checkDeadlink = require('../src/check-deadlink');

(async () => {
  const result = await checkDeadlink('https://www.geek.co.jp/', {
    deep: 1
  });

  console.log(result);
  debugger;
})()
  .catch(err => {
    console.error(err);
  })
