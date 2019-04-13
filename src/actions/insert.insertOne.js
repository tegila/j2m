const logger = process.env.DEBUG ? console.log : () => null;

module.exports = {
  props: {
    type: 'insert',
    subtype: 'insertOne'
  },
  input: (db, payload, resolve, reject) => {
    db.insertOne(payload.data, (err, result) => {
      logger(result);
      if (err) return reject(err);
      resolve(result);
    });
  }
}