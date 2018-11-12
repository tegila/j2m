var MongoClient = require('mongodb').MongoClient;
var async = require('async');

const mongoConnect = (url, callback) => {
    MongoClient.connect(url, {useNewUrlParser: true }, (err, connection) => {
        console.log('connecting mongodb server');
        if (!connection) setTimeout(() => {mongoConnect(url, callback);}, 1000);
        else callback(connection);
    });
}
module.exports = {
    connect: (url) => {
        return new Promise((resolve, reject) => {
            mongoConnect(url, (connection) => {
                resolve(connection);
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
    // Create actions
    insertOne: (collection, payload) => {
        const { data, options } = payload;
        return collection.insertOne(data, options);
    },
    insertMany: (collection, payload) => {
        const { data, options } = payload;
        return collection.insertMany(data, options);
    },
    // Read actions
    find: (collection, payload) => {
        const {query, filter, sort, skip, limit} = payload;

        return collection
        .find(query)
        .skip(isNaN(skip)? 0: parseInt(skip))
        .sort(typeof sort == 'undefined'? {'_id': -1}: sort)
        .limit(isNaN(limit)? 0: parseInt(limit));
    },
    // Update actions
    updateOne: (collection, payload) => {
        const { filter, update, options } = payload;
        return collection
        .updateOne(
            filter,
            { 
                $set: update
            },
            options 
        );
    },
    updateMany: (collection, payload) => {
        const { filter, update, options } = payload;
        return collection
        .updateMany(
            filter,
            { 
                $set: update
            },
            options 
        );
    },
    replaceOne: (collection, payload) => {
        const { filter, replacement, options } = payload;
        return collection
        .replaceOne(
            filter,
            replacement,
            options 
        );
    },
    // Delete actions
    deleteOne: (collection, payload) => {
        const { filter, options } = payload;
        return collection
        .deleteOne(
            filter,
            options
        );
    },
    deleteMany: (collection, payload) => {
        const { filter, options } = payload;
        return collection
        .deleteMany(
            filter,
            typeof options == 'undefined'? {}: options
        );
    }
}