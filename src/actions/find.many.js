module.exports = {
  props: {
    type: "find",
    subtype: "findMany"
  },
  input: (db, { filter, limit, skip, sort }, resolve, reject) => {
    db.find(filter, {
      skip,
      limit,
      sort
    }).toArray((err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  }
};
