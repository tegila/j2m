const logger = process.env.DEBUG ? console.log : () => null;

module.exports = {
  props: {
    type: 'insert',
    subtype: 'insertMany'
  },
  input: (db, payload, resolve, reject) => {
    db.insertMany(payload.data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  }
}