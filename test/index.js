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

  var dbconfig = {
    db: null,
    dbname: '',
    collection: null,
    collname: ''
  };
  
  const q = async.queue((raw_input, callback) => {
    if (dbconfig.db === null || dbconfig.dbname !== raw_input.database) {
      dbconfig.db = j2m.getDB(connection, raw_input.database);
      dbconfig.dbname = raw_input.database;
    }

    if (dbconfig.collection === null || dbconfig.collname != raw_input.collection) {
      console.log("one connection");
      dbconfig.collection = dbconfig.db.collection(raw_input.collection);
      dbconfig.collname = raw_input.collection;
    }
    
    j2m.input(dbconfig.collection, raw_input)
      .then((result) => {
        callback({payload: raw_input, data: result});
      });
  }, actions.length);
  
  q.drain = function() {
    console.log('All items have been processed');
    process.exit(1);
  };
  
  q.push(actions, (res) => {
    if (res.data.status == 'success')
      console.log(`'${res.payload.type}' operation on "${res.payload.collection}": `, res.data.data);
    else 
      console.log(`Error of '${res.payload.type}' operation on "${res.payload.collection}": `, res.data.msg);
    console.log("\n");
  });  
})
.catch(err => {
  console.log('Error is occured:', err);
  process.exit(1);
});
