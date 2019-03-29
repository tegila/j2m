module.exports = {
  props: {
    type: 'insert',
    subtype: 'insertOne'
  },
  input: (db, payload, resolve, reject) => {
    db.insertOne(payload.data, (err, result) => {
      // console.log(result);
      if (err) return reject(err);
      resolve(result);
    });
  }
}