const MongoClient = require('mongodb').MongoClient;
const mongoActions = require('./mongoActions');
const { validate_fields, validate} = require('./validate');

const url = `mongodb://${process.env.DOCKER ? 'mongo' : '127.0.0.1'}:27017/`;

const connect = () => {
  return mongoActions.connect(url);
}
const input = (connection, payload) => {
  var db = connection.db(payload.database);
  return new Promise((resolve, reject) => {
    var valid_results = validate_fields(payload);
      if (valid_results.status == 'failed') return reject(valid_results);
      var collection = db.collection(payload.collection);
      if (payload.type == 'find') {
        mongoActions.find(collection, payload).toArray((err, data) => {
          if (err) reject({msg: 'fetching data error'});
          else resolve(data);
        });
      } else {
        mongoActions[payload.type](collection, payload)
        .then(data => {
          resolve({status: 'success', msg: 'Success of operating ' + payload.type});
        })
        .catch(err => {
          reject({status: 'failed', msg: 'Failed of operating ' + payload.type});
        });
      }
  });
}

module.exports = {
  input: input,
  connect: connect
};
