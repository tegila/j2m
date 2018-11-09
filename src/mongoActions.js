var MongoClient = require('mongodb').MongoClient;
var async = require('async');

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

module.exports = {
    connect: (url, payload) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, (err, connection) => {
                if (!connection) reject({msg: 'connection error'});
                var db = connection.db(payload.database);
                validate(db, payload)
                .then(res => {
                    resolve(db);
                })
                .catch(err => {
                    reject(err);
                });
            });
        });
    },
    find: (collection, payload) => {
        const {query, filter, sort, skip, limit} = payload;

        return collection
            .find(typeof query == 'undefined'? {}: query, typeof filter == 'undefined'? {}: filter)
            .skip(isNaN(skip)? 0: parseInt(skip))
            .sort(typeof sort == 'undefined'? {}: sort)
            .limit(isNaN(limit)? 0: parseInt(limit));
    },
    insertOne: (collection, payload) => {
        const { data } = payload;
        return collection.insertOne(data);
    }
}