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
  
  async.eachSeries(actions, function(action, callback) {
    if (dbconfig.db === null || dbconfig.dbname !== action.database) {
      dbconfig.db = j2m.getDB(connection, action.database);
      dbconfig.dbname = action.database;
    }

    if (dbconfig.collection === null || dbconfig.collname != action.collection) {
      console.log("one connection");
      dbconfig.collection = dbconfig.db.collection(action.collection);
      dbconfig.collname = action.collection;
    }
    j2m.input(dbconfig.collection, action)
      .then((result) => {
        if (result.status == 'success')
          console.log(`'${action.type}' operation on "${action.collection}": `, result.data);
        else 
          console.log(`Error of '${action.type}' operation on "${action.collection}": `, result.msg);
        
        console.log("\n");
        callback();
      })
      .catch(err => {
        callback(err);
      });

  }, function(err) {
      if (err)
        console.log('Error:', err);
    process.exit(1);
  });
})
.catch(err => {
  console.log('Error is occured:', err);
  process.exit(1);
});