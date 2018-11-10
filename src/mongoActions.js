<<<<<<< HEAD
var MongoClient = require('mongodb').MongoClient;
var async = require('async');

module.exports = {
    connect: (url) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, (err, connection) => {
                if (!connection) reject({msg: 'connection error'});
                else resolve(connection);
            });
        });
    },
    validate: (db, payload) => {
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
    },
    find: (collection, payload) => {
        const {query, filter, sort, skip, limit} = payload;
=======
module.exports = {
  find: (collection, payload) => {
    const {query, filter, sort, skip, limit} = payload;
>>>>>>> 6b7448f86e9103f678ed56a7a07d489ebfee88c9

    return collection
      .find(typeof query == 'undefined'? {}: query, typeof filter == 'undefined'? {}: filter)
      .skip(isNaN(skip)? 0: parseInt(skip))
      .sort(typeof sort == 'undefined'? {}: sort)
      .limit(isNaN(limit)? 0: parseInt(limit));
  },
  insertOne: (collection, payload) => {
    const { data } = payload;
    return collection.insertOne(data);
  },
  updateOne: (collection, payload) => {
    const { filter, update, options } = payload;
    return collection
      .updateOne(
        typeof filter == 'undefined'? {}: filter,
        { 
            $set: typeof update=='undefined'? {}: update
        },
        typeof options=='undefined'? {}: options 
      );
  },
  remove: (collection, payload) => {
    const { query, options } = payload;
    return collection
      .remove(
        typeof query == 'undefined'? {}: query,
        typeof options == 'undefined'? {}: options
      );
  }
}