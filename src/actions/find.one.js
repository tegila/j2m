const logger = process.env.DEBUG ? console.log : null;

module.exports = {
  props: {
    type: "find",
    subtype: "findOne"
  },
  input: (db, payload, resolve, reject) => {
    db.findOne(payload.filter, (err, result) => {
      logger(result);
      if (err) return reject(err);
      resolve(result);
    });
  }
};
