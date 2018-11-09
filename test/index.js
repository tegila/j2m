const j2m = require('../src/index.js');
const insertJson = require('./task.insertOne.json');
const findJson = require('./task.find.json');
const updateJson = require('./task.updateOne.json');
const deleteJson = require('./task.remove.json');
var async = require('async');

// updateOne completed from false to true
// remove all completed true 

// this is test one:
// we try to query the __auth__/Profile and console.log the results.
// pls note should implement promisses as the old version.

// We try to make this: 
async.waterfall([
  (callback) => {
    console.log('database initial status');
    j2m.input(findJson)
      .then(console.log)
      .then(() => {
        callback(null, false);
      })
      .catch(err => {
        console.log(err);
        callback(null, true);
      });
  }, // insert testing
  (err, callback) => {
    if (err) return callback(null, true);
    j2m.input(insertJson)
      .then(res => {
        console.log(res);
        j2m.input(findJson)
          .then(data=> {
            console.log(data);
            callback(null, false);
          })
          .catch(err => {
            console.log(err);
            callback(null, true);
          });
      })
      .catch(err => {
        console.log(err);
        callback(null, true);
      });
  }, // update testing
  (err, callback) => {
    if (err) return callback(null, true);
    j2m.input(updateJson)
      .then(res => {
        console.log(res);
        j2m.input({
            "type": "find",
            "database": "app",
            "collection": "Todos",
            "query": {}
          })
          .then(data => {
            console.log(data);
            callback(null, false);
          })
          .catch(err => {
            console.log(err);
            callback(null, true);
          });
      })
      .catch(err => {
        console.log(err);
        callback(null, true);
      });
  }, // delete testing
  (err, callback) => {
    if (err) return callback();
    j2m.input(deleteJson)
      .then(res => {
        console.log(res);
        j2m.input({
            "type": "find",
            "database": "app",
            "collection": "Todos",
            "query": {}
          })
          .then(data => {
            console.log(data);
            callback();
          })
          .catch(err => {
            console.log(err);
            callback();
          });
      })
      .catch(err => {
        console.log(err);
        callback();
      });
  }
], () => {
  process.exit(1);
});