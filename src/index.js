const MongoClient = require('mongodb').MongoClient;
const mongoActions = require('./mongoActions');
const validate_fields = require('./validate').validate_fields;

const url = `mongodb://${process.env.DOCKER ? 'mongo' : '127.0.0.1'}:27017/`;

<<<<<<< HEAD
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
=======
const conn = new Promise((resolve, reject) => {
  MongoClient.connect(url, (err, connection) => {
    if (!connection) reject({msg: 'connection error'});
    var db = connection.db("test");
    resolve(db);
  });
});

module.exports = {
  input: (payload) => {
    return new Promise((resolve, reject) => {
      validate_fields(payload, reject);

      // filtering
      conn.then((db) => {
        const collection = db.collection(payload.collection);
        
        switch (payload.type) {
          case 'insertOne':
            mongoActions.insertOne(collection, payload)
              .then(res => resolve(res, {msg: 'Success of removing'}))
              .catch(err => reject(err, {msg: 'Failed of removing'}));
            break;
          case 'updateOne':
            mongoActions.updateOne(collection, payload)
              .then(res => resolve(res, {msg: 'Success of removing'}))
              .catch(err => reject(err, {msg: 'Failed of removing'}));
            break;
          case 'remove':
            mongoActions.remove(collection, payload)
              .then(res => resolve(res, {msg: 'Success of removing'}))
              .catch(err => reject(err, {msg: 'Failed of removing'}))
            break;
          case 'find':
            return resolve(mongoActions
              .find(collection, payload)
              .toArray((err, data) => {
                if (err) reject(res, {msg: 'fetching data error'});
                else resolve(err, data);
              })
            );
        }
      });
    })
  }
}
>>>>>>> 6b7448f86e9103f678ed56a7a07d489ebfee88c9
