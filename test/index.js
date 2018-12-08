const j2m = require('../src/index.js');
const createJson = require('./task.create.json');
const readJson = require('./task.read.json');
const updateJson = require('./task.update.json');
const deleteJson = require('./task.delete.json');
var async = require('async');
var queryBuilder = require('../querybuilder');

var findPayload = queryBuilder('app/Todos')
  .find()
  .eq("completed", false)
  .getPayload();

var insertPayload = queryBuilder('app/Todos')
  .insert('insertMany')
  .data([{
    title: 'First List',
    completed: false,
  },
  {
    title: 'Second List',
    completed: false,
  }])
  .getPayload();

var insertOnePayload = queryBuilder('app/Todos')
  .insert('insertOne')
  .data({
    title: 'temp List',
    quantity: 10,
    completed: true,
  })  
  .getPayload();

var updateOnePayload = queryBuilder('app/Todos')
  .updateOne({completed: true})
  .currentDate('lastmodified', true)
  .increment('quantity', 1)
  .getPayload();

var deleteFilter = queryBuilder('app/Todos')
  .queryMake()
  .eq("completed", false)
  .getPayload();

var deleteOnePayload = queryBuilder('app/Todos')
  .deleteOne(deleteFilter.payload.query)
  .getPayload();

var deleteManyFilter = queryBuilder('app/Todos')
  .queryMake()
  .eq("completed", true)
  .getPayload();

var deleteManyPayload = queryBuilder('app/Todos')
  .deleteMany(deleteManyFilter.payload.query)
  .getPayload();

// https://caolan.github.io/async/docs.html#queue
j2m.connect()
.then(connection => {
  var actions = [    
    findPayload,
    insertPayload,
    findPayload,
    updateOnePayload,
    findPayload,
    insertOnePayload,
    findPayload,
    deleteOnePayload,
    findPayload,
    deleteManyPayload,
    findPayload
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
      })
      .catch(err => {
        console.log('Error is occured', err);
        callback({payload: raw_input, data: {status: 'failed', msg: 'Unknow error'}});
        process.exit(0);
      });
  }, actions.length);
  
  q.drain = function() {
    console.log('All items have been processed');
    connection.close();
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
  process.exit(0);
});
