const logger = process.env.DEBUG ? console.log : () => null;

module.exports = {
  props: {
    type: 'delete',
    subtype: 'deleteOne'
  },
  input: (db, payload, resolve, reject) => {
    db.deleteOne(payload.filter, (err, result) => {
      logger(result);
      if (err) return reject(err);
      resolve(result);
    });
  }
}
