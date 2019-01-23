module.exports = (runners) => {
  runners.push({
    props: {
      type: 'insert',
      subtype: 'insertMany'
    },
    input: (db, payload, resolve, reject) => {
      db.insertMany(payload.data, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    }
  });
}