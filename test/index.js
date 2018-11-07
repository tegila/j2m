const j2m = require('../index.js');
const test1 = require('test1.json');

// this is test one:
// we try to query the __auth__/Profile and console.log the results.
// pls note should implement promisses as the old version.
j2m
  .input(test1)
  .then(console.log);
  
