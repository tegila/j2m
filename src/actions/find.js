module.exports = (runners) => {
  runners.push({
    props: {
      type: 'find',
      subtype: 'findOne'
    },
    input: (db, payload, resolve, reject) => {
      db.findOne(payload.filter, (err, result) => {
        // console.log(result);
        if (err) return reject(err);
        resolve(result);
      });
    }
  });
}