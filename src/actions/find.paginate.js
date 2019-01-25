module.exports = runners => {
  runners.push({
    props: {
      type: "find",
      subtype: "paginate"
    },
    input: (db, payload, resolve, reject) => {
      db.find(payload.filter)
        .skip(payload.skip || 0)
        .limit(payload.limit || 0)
        .toArray((err, docs) => {
          if (err) return reject(err);
          resolve(docs);
        });
    }
  });
};
