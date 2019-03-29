module.exports = {
  props: {
    type: "find",
    subtype: "complex"
  },
  input: (db, { filter, sort, skip, limit }, resolve, reject) => {
    db.find(
      filter,
      {
        sort,
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
