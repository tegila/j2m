const j2m = require('../src/index.js');
const createJson = require('./task.create.json');
const readJson = require('./task.read.json');
const updateJson = require('./task.update.json');
const deleteJson = require('./task.delete.json');
var async = require('async');

// https://caolan.github.io/async/docs.html#queue
j2m.connect()
.then(connection => {
  var actions = [
    readJson.findAll,
    createJson.insertOne,
    readJson.withQuery,
    createJson.insertMany,
    readJson.findAll,
    updateJson.updateOne,
    readJson.findAll,
    updateJson.updateMany,
    readJson.findAll,
    deleteJson.deleteOne,
    readJson.findAll,
    deleteJson.deleteMany,
    readJson.findAll
  ];

  const q = async.queue((raw_input, callback) => {
    j2m.input(connection, raw_input)
      .then(console.log)
      .then(callback)
      .catch(err => {
        console.log(err);
        callback();
      });
  }, actions.length);
  
  q.drain = function() {
    console.log('all items have been processed');
    process.exit(1);
  };
  
  q.push(actions, () => {
    console.log('database initial status');
  });  
})
.catch(err => {
  console.log(err);
  process.exit(1);
});
