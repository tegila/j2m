module.exports = {
  props: {
    type: "update",
    subtype: "updateOne"
  },
  input: (db, { filter, update }, resolve, reject) => {
    // console.log(payload.data);
    db.updateOne(filter, { $set: update }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  }
};
