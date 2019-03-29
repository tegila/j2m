const chai = require("chai");
const should = chai.should(),
  expect = chai.expect;
const J2M = require("../src");
const queryBuilder = require("querybuilder");

const j2m = J2M(`mongodb://${process.env.DATABASE_URL || "localhost"}:27017`);

const base = queryBuilder()
  .database("app")
  .collection("Todos");

const database_error_exit = (err) => {
  console.log(err);
  console.log("database exit error");
  j2m.close();
  process.exit(1);
};

describe("Paginate Pattern", () => {
  it("should be able to insert many documents at same time", done => {
    const insert_many = base
      .insert()
      .many([
        {
          task_name: "morning code",
          status: "to_be_done"
        },
        {
          task_name: "lunch code",
          status: "to_be_done"
        },
        {
          task_name: "coffee code",
          status: "to_be_done"
        },
        {
          task_name: "dinner code",
          status: "to_be_done"
        }
      ])
      .value();
    j2m
      .exec(insert_many)
      .then(ret => {
        // console.log(ret.ops);
        done();
      })
      .catch(database_error_exit);
  });

  it("it should be able to count", done => {
    const basic_find = base
      .find({})
      .count()
      .value();
    j2m
      .exec(basic_find)
      .then(ret => {
          // console.log(ret);
          done();
      })
      .catch(database_error_exit);
  });

  it("should be able to limit a query", done => {
    const find_limit = base
      .find({})
      .limit(3)
      .value();
    j2m
      .exec(find_limit)
      .then(ret => {
        // console.log(ret);
        done();
      })
      .catch(database_error_exit);
  });

  it("should be able to skip some documents", done => {
    const find_skip = base
      .find({})
      .skip(2)
      .value();
    j2m
      .exec(find_skip)
      .then(ret => {
        // console.log(ret);
        done();
      })
      .catch(database_error_exit);
  });

  after(function(done) {
    j2m.close();
    done();
  });
});
