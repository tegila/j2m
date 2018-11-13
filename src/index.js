const MongoClient = require('mongodb').MongoClient;
const mongoActions = require('./mongoActions');
const { validate_fields, validate} = require('./validate');

const url = `mongodb://${process.env.DOCKER ? 'mongo' : '127.0.0.1'}:27017/`;

const connect = () => {
  return mongoActions.connect(url);
}
const input = (collection, payload) => {
  
  return new Promise((resolve, reject) => {
    var valid_results = validate_fields(payload);
      if (valid_results.status == 'failed') return reject(valid_results);
      
      if (payload.type == 'find') {
        mongoActions.find(collection, payload).toArray((err, data) => {
          if (err) reject({status: 'failed', msg: `fetching data error from ${payload.collection}`});
          else resolve({status: 'success', data: data});
        });
      } else {
        mongoActions[payload.type](collection, payload)
        .then(data => {
          resolve({status: 'success', data: 'Success of operating ' + payload.type + ' on ' + payload.collection});
        })
        .catch(err => {
          reject({status: 'failed', msg: 'Failed of operating ' + payload.type + ' on ' + payload.collection});
        });
      }
  });
}

const getDB = (connection, dbname) => {
  return connection.db(dbname);
}
module.exports = {
  input: input,
  connect: connect,
  getDB: getDB
};
