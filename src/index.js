const MongoClient = require('mongodb').MongoClient;
const mongoActions = require('./mongoActions');
const { validate_fields, validate} = require('./validate');

const url = 'mongodb://127.0.0.1:27017';

const connect = () => {
  return mongoActions.connect(url);
}
const input = (collection, transaction) => {
  
  return new Promise((resolve, reject) => {
      var valid_results = validate_fields(transaction);
      // console.log(valid_results);
      if (valid_results.status == 'failed') return reject(valid_results);
      
      if (transaction.type == 'find') {
        mongoActions.find(collection, transaction.payload).toArray((err, data) => {
          if (err) reject({status: 'failed', msg: `fetching data error from ${transaction.collection}`});
          else resolve({status: 'success', data: data});
        });
      } else {
        mongoActions[transaction.type](collection, transaction.payload)
        .then(data => {
          resolve({status: 'success', data: 'Success of operating ' + transaction.type + ' on ' + transaction.collection});
        })
        .catch(err => {
          reject({status: 'failed', msg: 'Failed of operating ' + transaction.type + ' on ' + transaction.collection});
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
