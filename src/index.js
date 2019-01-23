var MongoClient = require("mongodb").MongoClient;

let base_url = null;
let db = null;
const runners = [];

const normalizedPath = require("path").join(__dirname, "actions");

require("fs")
  .readdirSync(normalizedPath)
  .forEach(file => {
    require("./actions/" + file)(runners);
  });

const connect = () => {
  console.log("connecting...");
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      base_url,
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
        console.log(err);
        if (!err) return resolve(datalink);
        return reject(err);
      }
    );
  });
};

const close = () => {
  return db.close();
  db = null;
};

const select_collection = (database, collection) => {
  return new Promise((resolve, reject) => {
    // console.log(database, collection);
    if (db !== null) return resolve(db.db(database).collection(collection));
    connect()
      .then(connection =>
        resolve(connection.db(database).collection(collection))
      )
      .catch(reject);
  });
};

const exec = ({ database, collection, type, payload }) => {
  return new Promise((resolve, reject) => {
    select_collection(database, collection).then(db => {
      // console.log(type, payload.type);
      runners.forEach(({ props, input }) => {
        // console.log(props);
        if (props.type === type && props.subtype === payload.type)
          input(db, payload, resolve, reject);
      });
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

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing mongodb server.');
  db.close(() => {
    console.log('mongodb server closed.');
  });
});
