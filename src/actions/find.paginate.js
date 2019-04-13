const logger = process.env.DEBUG ? console.log : null;

module.exports = {
  props: {
    type: "find",
    subtype: "paginate"
  },
  input: (db, { filter, sort, skip, limit }, resolve, reject) => {
    db.find(filter, {
      sort,
      skip,
      limit
    }).toArray((err, docs) => {
      if (err) return reject(err);
      resolve(docs);
    });
  }
};
