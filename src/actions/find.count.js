module.exports = (runners) => {
  runners.push({
    props: {
      type: 'find',
      subtype: 'count'
    },
    input: (db, payload, resolve, reject) => {
      db.countDocuments(payload.filter, (payload.limit, payload.skip, payload.hint, payload.maxTimeMS), (err, result) => {
        // console.log(result);
        if (err) return reject(err);
        resolve(result);
      });
    }
  });
}

