const MongoClient = require('mongodb').MongoClient;
const mongoActions = require('./mongoActions');
const validate_fields = require('./validate').validate_fields;

const url = `mongodb://${process.env.DOCKER ? 'mongo' : '127.0.0.1'}:27017/`;

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
