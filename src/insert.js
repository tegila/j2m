module.exports = {
  input: (db, payload, resolve, reject) => {
    db.insertOne(payload.data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  }
}