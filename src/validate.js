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

const validate_fields = (payload, reject) => {
  if (!payload || typeof payload.database == 'undefined')
    return ({status: 'failed', msg: "database is undefined"});
  if (!payload || typeof payload.type == 'undefined' || payload.type == '')
    return ({status: 'failed', msg: "Type is undefined!"});
  return ({status: 'ok'});
};

module.exports = {
  validate,
  validate_fields
}
