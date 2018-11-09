const j2m = require('../src/index.js');
const test1 = require('./task.insertOne.json');
const test2 = require('./task.find.json');
// updateOne completed from false to true
// remove all completed true 

// this is test one:
// we try to query the __auth__/Profile and console.log the results.
// pls note should implement promisses as the old version.

// We try to make this: 
j2m
  .input(test1)
  .then((response) => {
    console.log(response);
  })
  .then(() => {
    j2m
      .input(test2)
      .then(console.log)
      .catch(console.log)
      .then(() => {
        process.exit(1);
      });
  })
  .catch(console.log);
  
// into this:
// const { query, filter, sort, skip, limit }  = json1
// db.Profiles.find(query, filter).sort(sort).skip(skip).limit(limit);
// and send the answer back
