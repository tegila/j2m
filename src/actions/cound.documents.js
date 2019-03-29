module.exports = {
  props: {
    type: "find",
    subtype: "countDocuments"
  },
  input: (db, { filter, skip, limit }, resolve, reject) => {
    db.countDocuments(
      filter,
      {
        skip,
        limit
      },
      (err, result) => {
        // console.log(result);
        if (err) return reject(err);
        resolve(result);
      }
    );
  }
};
