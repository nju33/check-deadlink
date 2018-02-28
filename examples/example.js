require('ts-node/register');
const checkDeadlink = require('../src/check-deadlink');

(async () => {
  const result = await checkDeadlink('https://www.geek.co.jp/', {
    verbose: true
  });

  console.log(result);
})()
  .catch(err => {
    console.error(err);
  })
