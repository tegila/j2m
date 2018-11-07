module.exports = {
    exec: (collection, payload) => {
        return new Promise((resolve, reject) => {
            var where = {};
            if (typeof payload.filter != 'undefined') {
                where = payload.filter;
            }
            
            // skipping
            var skip = 0;
            if (typeof payload.skip != 'undefined') {
                skip = payload.skip;
            }

            // sorting
            var sort = { '_id': 1 };
            if (typeof payload.sort != 'undefined') {
                sort = payload.sort;
            }

            // limitation
            var limit = 10;
            if (typeof payload.limit != 'undefined') {
                limit = parseInt(payload.limit);
            }

            collection
                .find(where)
                .skip(skip)
                .sort(sort)
                .limit(limit)
                .toArray((err, rows) => {
                    if (err) return reject(err);
                    var result = [];
                    if (rows.length > 0) {
                        rows.forEach(row => {
                            if (typeof payload.query != 'undefined' && Object.keys(payload.query).length > 0) {
                            var temprow = {};
                            Object.keys(payload.query).forEach(cell => {
                                temprow[cell] = row[cell]
                            });
                                result.push(temprow);
                            } else {
                                result.push(row);
                            }
                        });
                    }
                    resolve(result);
                });
        });
    }
}