var MongoClient = require("mongodb").MongoClient;
const runner = {
  find: require("./find"),
  insert: require("./insert")
};

let base_url = null;
let db = null;

const connect = url => {
  console.log("connect");
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        autoReconnect: true,
        // retry to connect for 60 times
        reconnectTries: 60,
        // wait 1 second before retrying
        reconnectInterval: 1000
      },
      (err, datalink) => {
        db = datalink;
        if (!err) return resolve(datalink);
        return reject(err);
      }
    );
  });
};

const close = () => db.close();

const select_collection = (database, collection) => {
  return new Promise((resolve, reject) => {
    console.log(database, collection);
    if (db !== null) return resolve(db.db(database).collection(collection));
    connect(base_url)
      .then(connection =>
        resolve(connection.db(database).collection(collection))
      )
      .catch(reject);
  });
};

const exec = ({ database, collection, type, payload }) => {
  return new Promise((resolve, reject) => {
    select_collection(database, collection).then(db => {
      console.log(type)
      runner[type].input(db, payload, resolve, reject);
    });
  });
};

const J2M = url => {
  base_url = url;
  return {
    connect,
    close,
    select_collection,
    exec
  };
};

module.exports = J2M;

