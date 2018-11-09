module.exports = {
  find: (collection, payload) => {
    const {query, filter, sort, skip, limit} = payload;

    return collection
      .find(typeof query == 'undefined'? {}: query, typeof filter == 'undefined'? {}: filter)
      .skip(isNaN(skip)? 0: parseInt(skip))
      .sort(typeof sort == 'undefined'? {}: sort)
      .limit(isNaN(limit)? 0: parseInt(limit));
  },
  insertOne: (collection, payload) => {
    const { data } = payload;
    return collection.insertOne(data);
  },
  updateOne: (collection, payload) => {
    const { filter, update, options } = payload;
    return collection
      .updateOne(
        typeof filter == 'undefined'? {}: filter,
        { 
            $set: typeof update=='undefined'? {}: update
        },
        typeof options=='undefined'? {}: options 
      );
  },
  remove: (collection, payload) => {
    const { query, options } = payload;
    return collection
      .remove(
        typeof query == 'undefined'? {}: query,
        typeof options == 'undefined'? {}: options
      );
  }
}