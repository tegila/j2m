module.exports = {
  input: (db, payload, resolve, reject) => {
    db.deleteOne(payload.filter, (err, result) => {
      // console.log(result);
      if (err) return reject(err);
      resolve(result);
    });
  }
}

