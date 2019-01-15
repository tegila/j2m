module.exports = {
  input: (db, payload, resolve, reject) => {
    console.log(payload.data);
    db.updateOne(payload.data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  }
}