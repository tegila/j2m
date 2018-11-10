var async = require('async');
var mongoActions = require('./mongoActions');
const validate = (db, payload) => {
  return new Promise((resolve, reject) => {
    async.waterfall([
      function(callback) {
        db.admin().listDatabases((err, results) => {
          if (err) callback(null, true, 'Checking error of database valid!');
          else {
            if (typeof results.databases == 'undefined' || results.databases.length <= 0) {
              callback(null, true, 'The database ' + payload.database + ' is not existed on mongodb server!');
            } else {
              var flag = false;
              results.databases.forEach(database => {
                if(database.name == payload.database) flag = true;
              });

              if (flag) callback(null, false, 'Valid database');
              else callback(null, true, `The database "${payload.database}" is not existed on mongodb server!`);
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
                  if (coll.name == payload.collection) flag=true;
                });
                if (flag) callback(false, 'Valid collection');
                else callback(true, `The collection "${payload.collection}" is not existed"`);
              } else {
                callback(true, `The collection "${payload.collection}" is not existed"`);
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

const validate_fields = (payload, reject) => {
  const verbs = Object.keys(mongoActions);
  
  if (!payload) return({status: 'failed', msg: "param is blank"});
  if (typeof payload.database == 'undefined' || payload.database.trim() == '')
    return ({status: 'failed', msg: "database is undefined"});
  if (typeof payload.collection == 'undefined' || payload.collection.trim() == '')
    return ({status: 'failed', msg: "collection is undefined"});
  if (typeof payload.type == 'undefined' || payload.type.trim() == '')
    return ({status: 'failed', msg: "Type is undefined!"});
  if (verbs.indexOf(payload.type.trim()) < 0)
    return ({status: 'failed', msg: 'Wrong verb type'});

  var type = payload.type.trim();
  // validation of each params
  if (['insertOne', 'insertMany'].indexOf(type) >= 0) {
    if (typeof payload.data == 'undefined' || Object.keys(payload.data).length <= 0)
      return ({status: 'failed', msg: 'Inserting data is blank'});
    if (type == 'insertOne' && (typeof payload.data != 'object' || !payload.data))
      return ({status: 'failed', msg: 'Wrong insert data type'});
    if (type == 'insertMany' && (!Array.isArray(payload.data) || payload.data.indexOf(null) >= 0 || Object.keys(payload.data).indexOf('null')>= 0))
      return ({status: 'failed', msg: 'Wrong insertMany data type'});
  }

  if (['find'].indexOf(type) >= 0) {
    if (typeof payload.query == 'undefined') return ({status: 'failed', msg: "query is undefined!"});
    if (typeof payload.query != 'object') return ({status: 'failed', msg: "query type wrong!"});
  }

  if (['updateOne', 'updateMany', 'replaceOne', 'deleteOne', 'deleteMany'].indexOf(type) >= 0) {
    if (typeof payload.filter == 'undefined') return ({status: 'failed', msg: "filter is undefined!"});
    if (typeof payload.filter != 'object' || (!payload.filter && ['deleteOne', 'deleteMany'].indexOf < 0)) return ({status: 'failed', msg: "filter type wrong!"});

    if (['updateOne', 'updateMany'].indexOf(type) >= 0) {
      if (typeof payload.update == 'undefined') return ({status: 'failed', msg: "update data is undefined!"});
      if (Object.keys(payload.update).length <= 0) return ({status: 'failed', msg: "update data is blank!"});
      if (typeof payload.update != 'object' || !payload.update) return ({status: 'failed', msg: "update data type wrong!"});
    }

    if (type == 'replaceOne') {
      if (typeof payload.replacement == 'undefined') return ({status: 'failed', msg: "replace data is undefined!"});
      if (typeof payload.replacement != 'object' || !payload.replacement) return ({status: 'failed', msg: "replace data type wrong!"});
    }
  }

  return ({status: 'ok'});
};

module.exports = {
  validate,
  validate_fields
}
