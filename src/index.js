var async = require('async');
var mongoActions = require('./mongoActions');

const url = `mongodb://${process.env.DOCKER ? 'mongo' : '127.0.0.1'}:27017/`;

const connect = () => {
  return mongoActions.connect(url);
}
const input = (connection, payload) => {
  var db = connection.db(payload.database);
  return new Promise((resolve, reject) => {
    if (!payload || typeof payload.database == 'undefined')
      reject({status: 'failed', msg: "database is undefined"});
    if (!payload || typeof payload.type == 'undefined' || payload.type == '')
      reject({status: 'failed', msg: "Type is undefined!"});

    var collection = db.collection(payload.collection);
    if (payload.type == 'find') {
      mongoActions.find(collection, payload).toArray((err, data) => {
        if (err) reject({msg: 'fetching data error'});
        else resolve(data);
      });
    } else {
      mongoActions[payload.type](collection, payload)
      .then(data => {
        resolve({statue: 'success', msg: 'Success of operating ' + payload.type});
      })
      .catch(err => {
        reject({statue: 'failed', msg: 'Failed of operating ' + payload.type});
      });
    }
  });
}

module.exports = {
  input: input,
  connect: connect
};