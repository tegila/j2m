const j2m = require('../src/index.js');
const insertJson = require('./task.insertOne.json');
const findJson = require('./task.find.json');
const updateJson = require('./task.updateOne.json');
const deleteJson = require('./task.remove.json');
var async = require('async');

// https://caolan.github.io/async/docs.html#queue
const q = async.queue((raw_input) => {
  return (callback) => {
    j2m.input(raw_input)
    .then(console.log)
    .then(() => {
      callback(null, false);
    })
    .catch(err => {
      console.log(err);
      callback(err, null);
    });
  }
}, 1);
// 1 each time (Series)

q.drain = function() {
  console.log('all items have been processed');
  process.exit(1);
};

q.push([insertJson, findJson, updateJson, deleteJson], () => {
  console.log('database initial status');
});