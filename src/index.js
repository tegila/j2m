var MongoClient = require("mongodb").MongoClient;

let base_url = null;
let db = null;
const runners = [];

// https://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder
const normalizedPath = require("path").join(__dirname, "actions");

require("fs")
  .readdirSync(normalizedPath)
  .forEach(file => {
    runners.push(require("./actions/" + file));
  });

const connect = url => {
  console.log("connecting...");
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
        console.log(err);
        if (!err) return resolve(datalink);
        return reject(err);
      }
    );
  });
};

const close = () => {
  db.close();
  db = null;
};

const select_collection = (database, collection) => {
  return new Promise((resolve, reject) => {
    // console.log(database, collection);
    if (db !== null) return resolve(db.db(database).collection(collection));
    connect(base_url)
      .then(connection =>
        resolve(connection.db(database).collection(collection))
      )
      .catch(reject);
  });
};

const exec = ({ database, collection, payload }) => {
  return new Promise((resolve, reject) => {
    select_collection(database, collection).then(db => {
      // console.log(type, payload.type);
      const found = runners.find(({ props }) => {
        // console.log(props);
        return (props.type === payload.type && props.subtype === payload.subtype)
      });
      
      if(found) {
        found.input(db, payload, resolve, reject);
      } else {
        reject("action method not found");
      }
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
