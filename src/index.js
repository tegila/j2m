var async = require('async');
var mongoActions = require('./mongoActions');

const url = `mongodb://${process.env.DOCKER ? 'mongo' : '127.0.0.1'}:27017/`;
const input = (payload) => {
  return new Promise((resolve, reject) => {
    if (!payload || typeof payload.database == 'undefined')
      reject({status: 'failed', msg: "database is undefined"});
    if (!payload || typeof payload.type == 'undefined' || payload.type == '')
      reject({status: 'failed', msg: "Type is undefined!"});
    async.waterfall([
      function(callback) {
        mongoActions.connect(url, payload)
        .then(db => {
          callback(null, false, {db: db});
        })
        .catch(err => {
          callback(null, true, {msg: err.msg});
        });
      }, // checking database is valid or not
      function(error, data, callback) {
        if (error) return callback(error, data);
        // filtering
        var db = data.db;
        var collection = db.collection(payload.collection);
        
        switch (payload.type) {
          case 'insertOne':
            mongoActions.insertOne(collection, payload)
            .then(data => {
              callback(null, {msg: 'Success inserting'});
            })
            .catch(err => {
              callback(true, {msg: 'Failed of inserting'});
            });
            break;
          case 'updateOne':
            mongoActions.updateOne(collection, payload)
            .then(data => {
              callback(null, {msg: 'Success updating'});
            })
            .catch(err => {
              callback(true, {msg: 'Failed of updating'});
            });
            break;
          case 'remove':
            mongoActions.remove(collection, payload)
            .then(res => {
              callback(null, {msg: 'Success of removing'});
            })
            .catch(err => {
              callback(true, {msg: 'Failed of removing'});
            })
            break;
          default:
            mongoActions.find(collection, payload).toArray((err, data) => {
              if (err) callback(true, {msg: 'fetching data error'});
              else callback(null, data);
            });
            break;
        }
      }
    ], function(error, result) {
      if (error) reject({status: 'failed', msg: result.msg});
      else resolve({status: 'success', data: result});
    });
  });
}

module.exports = {
  input: input
}