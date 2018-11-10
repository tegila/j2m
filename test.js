const conn = new Promise((resolve, reject) => {
    resolve("123123");
});

conn
    .then(console.log)
    .then(console.log);