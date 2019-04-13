const logger = process.env.DEBUG ? console.log : null;

module.exports = {
  props: {
    type: "update",
    subtype: "updateOne"
  },
  input: (db, { filter, update }, resolve, reject) => {
    logger(payload.data);
    db.updateOne(filter, { $set: update }, (err, result) => {
      logger(result);
      if (err) return reject(err);
      resolve(result);
    });
  }
};
