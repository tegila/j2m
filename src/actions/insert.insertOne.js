module.exports = (runners) => {
  runners.push({
    props: {
      type: 'insert',
      subtype: 'insertOne'
    },
    input: (db, payload, resolve, reject) => {
      db.insertOne(payload.data, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    }
  });
}