var async = require('async');
var mongoActions = require('./mongoActions');
const validate = (db, transaction) => {
  return new Promise((resolve, reject) => {
    async.waterfall([
      function(callback) {
        db.admin().listDatabases((err, results) => {
          if (err) callback(null, true, 'Checking error of database valid!');
          else {
            if (typeof results.databases == 'undefined' || results.databases.length <= 0) {
              callback(null, true, 'The database ' + transaction.database + ' is not existed on mongodb server!');
            } else {
              var flag = false;
              results.databases.forEach(database => {
                if(database.name == transaction.database) flag = true;
              });

              if (flag) callback(null, false, 'Valid database');
              else callback(null, true, `The database "${transaction.database}" is not existed on mongodb server!`);
            }
          }
        });
      },
      function(err, msg, callback) {
          if (err) return callback(err, msg);
          db.listCollections().toArray(function(err, colls) {
            if (err) callback(true, 'Checking error of collection valid');
            else {
              if (colls.length > 0) {
                var flag = false;
                colls.forEach(coll => {
                  if (coll.name == transaction.collection) flag=true;
                });
                if (flag) callback(false, 'Valid collection');
                else callback(true, `The collection "${transaction.collection}" is not existed"`);
              } else {
                callback(true, `The collection "${transaction.collection}" is not existed"`);
              }
            }
          });
        }
    ], (err, msg) => {
        if (err) reject({valid: false, msg: msg});
        else resolve({valid: true, msg: msg});
    });
  });
};

const validate_fields = (transaction, reject) => {
  const verbs = Object.keys(mongoActions);
  
  if (!transaction) return({status: 'failed', msg: "param is blank"});
  if (typeof transaction.database == 'undefined' || transaction.database.trim() == '')
    return ({status: 'failed', msg: "database is undefined"});
  if (typeof transaction.collection == 'undefined' || transaction.collection.trim() == '')
    return ({status: 'failed', msg: "collection is undefined"});
  if (typeof transaction.type == 'undefined' || transaction.type.trim() == '')
    return ({status: 'failed', msg: "Type is undefined!"});
  if (verbs.indexOf(transaction.type.trim()) < 0)
    return ({status: 'failed', msg: 'Wrong verb type'});

  var type = transaction.type.trim();
  // validation of each params
  if (['insertOne', 'insertMany'].indexOf(type) >= 0) {
    if (typeof transaction.payload.data == 'undefined' || Object.keys(transaction.payload.data).length <= 0)
      return ({status: 'failed', msg: 'Inserting data is blank'});
    if (type == 'insertOne' && (typeof transaction.payload.data != 'object' || !transaction.payload.data))
      return ({status: 'failed', msg: 'Wrong insert data type'});
    if (type == 'insertMany' && (!Array.isArray(transaction.payload.data) || transaction.payload.data.indexOf(null) >= 0 || Object.keys(transaction.payload.data).indexOf('null')>= 0))
      return ({status: 'failed', msg: 'Wrong insertMany data type'});
  }

  if (['find'].indexOf(type) >= 0) {
    if (typeof transaction.payload.query == 'undefined') return ({status: 'failed', msg: "query is undefined!"});
    if (typeof transaction.payload.query != 'object') return ({status: 'failed', msg: "query type wrong!"});
  }

  if (['updateOne', 'updateMany', 'replaceOne', 'deleteOne', 'deleteMany'].indexOf(type) >= 0) {
    if (typeof transaction.payload.filter == 'undefined') return ({status: 'failed', msg: "filter is undefined!"});
    if (typeof transaction.payload.filter != 'object' || (!transaction.filter && ['deleteOne', 'deleteMany'].indexOf < 0)) return ({status: 'failed', msg: "filter type wrong!"});

    if (['updateOne', 'updateMany'].indexOf(type) >= 0) {
      if (typeof transaction.payload.update == 'undefined') return ({status: 'failed', msg: "update data is undefined!"});
      if (Object.keys(transaction.payload.update).length <= 0) return ({status: 'failed', msg: "update data is blank!"});
      if (typeof transaction.payload.update != 'object' || !transaction.payload.update) return ({status: 'failed', msg: "update data type wrong!"});
    }

    if (type == 'replaceOne') {
      if (typeof transaction.payload.replacement == 'undefined') return ({status: 'failed', msg: "replace data is undefined!"});
      if (typeof transaction.payload.replacement != 'object' || !transaction.payload.replacement) return ({status: 'failed', msg: "replace data type wrong!"});
    }
  }

  return ({status: 'ok'});
};

module.exports = {
  validate,
  validate_fields
}
