var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var findModel = require('./find');

const url = `mongodb://${process.env.DOCKER ? 'mongo' : '127.0.0.1'}:27017/`;
const input = (payload) => {
  return new Promise((resolve, reject) => {
    if (!payload || typeof payload.database == 'undefined')
      reject({status: 'failed', msg: "database is undefined"});
    if (!payload || typeof payload.type == 'undefined' || payload.type == '')
      reject({status: 'failed', msg: "Type is undefined!"});
    async.waterfall([
      function(callback) {
        MongoClient.connect(url, (err, connection) => {
          if (!connection) return callback(null, true, {msg: 'connection error'});
          return callback(null, false, {db: connection.db(payload.database)});
        });
      },
      function(error, data, callback) {
        if (error) return callback(error, data);
        // filtering
        var db = data.db;
        var cursor = db.collection(payload.collection);
        
        switch (payload.type) {
          case 'update':
            break;
          case 'save':
            break;
          case 'delete':
            break;
          default:
            findModel.exec(cursor, payload).then(data => {
              callback(null, data);
            })
            .catch(err => {
              callback(true, {msg: 'fetching data error'});
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