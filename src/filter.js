module.exports = {
  input: (db, payload, resolve, reject) => {
    db.findOne(payload, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  }
}