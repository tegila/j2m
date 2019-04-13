const logger = process.env.DEBUG ? console.log : null;

const chai = require("chai");
const should = chai.should(),
  expect = chai.expect;
const J2M = require("../src");

const j2m = J2M(`mongodb://${process.env.DATABASE_URL || "localhost"}:27017`);

const database_error_exit = () => {
  logger("database error exit");
  j2m.close();
  process.exit(1);
};

describe("Connection Pattern", () => {
  it("should be able to connect", done => {
    j2m.connect().then(done).catch(database_error_exit)
  });

  it("should be able to disconnect", () => {
    j2m.close();
  });

  it("it should be able to reconnect again", done => {
    j2m.connect().then(done).catch(database_error_exit);
  });

  after(function(done) {
    j2m.close();
    done();
  });

});
