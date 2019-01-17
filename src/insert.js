module.exports = {
  input: (db, payload, resolve, reject) => {
    if (payload.type == "insertOne") {
      db.insertOne(payload.data, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    } else if (payload.type == "insertMany") {
      db.insertMany(payload.data, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    }
  }
}
