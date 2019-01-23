const chai = require("chai");
const should = chai.should(),
  expect = chai.expect;
const J2M = require("../src");
const queryBuilder = require("../querybuilder");

const j2m = J2M(`mongodb://${process.env.DATABASE_URL || "localhost"}:27017`);

const base = queryBuilder()
  .database("app")
  .collection("Todos");

const database_error_exit = () => {
  console.log("database error exit");
  j2m.close();
  process.exit(1);
};

describe("CRUD Pattern", () => {
  it("should be able to insert a document", done => {
    const basic_insert = base
      .insert({
        task_name: "morning code",
        status: "to_be_done"
      })
      .value();
    j2m
      .exec(basic_insert)
      .then(ret => {
        // console.log(ret.ops);
        done();
      })
      .catch(database_error_exit);
  });

  it("should be able to query a document", done => {
    const basic_find = base.find({}).value();
    j2m
      .exec(basic_find)
      .then(ret => {
        // console.log(ret);
        done();
      })
      .catch(database_error_exit);
  });

  it("it should be able to update a previous found document", done => {
    const basic_find = base.find({}).value();
    j2m
      .exec(basic_find)
      .then(ret => {
        const basic_update = base
          .update(ret)
          .with({
            status: "crud done"
          })
          .value();
        // console.log(basic_removal);
        j2m
          .exec(basic_update)
          .then(ret => {
            // console.log(ret);
            done();
          })
          .catch(database_error_exit);
      })
      .catch(database_error_exit);
  });

  it("it should be able to remove a previous found document", done => {
    const basic_find = base.find({ status: "crud done" }).value();

    j2m
      .exec(basic_find)
      .then(ret => {
        const basic_removal = base.remove(ret).value();
        // console.log(basic_removal);
        j2m
          .exec(basic_removal)
          .then(ret => {
            // console.log(ret);
            done();
          })
          .catch(database_error_exit);
      })
      .catch(database_error_exit);
  });
});
