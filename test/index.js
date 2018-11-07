const j2m = require('../index.js');
const test1 = require('test1.json');

// this is test one:
// we try to query the __auth__/Profile and console.log the results.
// pls note should implement promisses as the old version.

// We try to make this: 
j2m
  .input(test1)
  .then(console.log);
  
// into this:
// const { query, filter, sort, skip, limit }  = json1
// db.Profiles.find(query, filter).sort(sort).skip(skip).limit(limit);
// and send the answer back
