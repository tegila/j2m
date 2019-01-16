module.exports = {
  input: (db, payload, resolve, reject) => {
    // console.log(payload.data);
    db.updateOne(payload.filter, {$set: payload.update}, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  }
}
