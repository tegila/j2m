const j2m = require('../src/index.js');
const insertJson = require('./task.insertOne.json');
const findJson = require('./task.find.json');
const updateJson = require('./task.updateOne.json');
const deleteJson = require('./task.remove.json');
var async = require('async');

// https://caolan.github.io/async/docs.html#queue
j2m.connect()
.then(connection => {
  var actions = [
    findJson,
    insertJson,
    findJson,
    updateJson,
    {
      "type": "find",
      "database": "app",
      "collection": "Todos",
      "query": {}
    },
    deleteJson,
    {
      "type": "find",
      "database": "app",
      "collection": "Todos",
      "query": {}
    }
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
  // 1 each time (Series)
  
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
