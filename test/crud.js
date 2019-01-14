const chai = require('chai');
const should = chai.should(),
  expect = chai.expect;
const J2M = require('../src');
const queryBuilder = require('../querybuilder');

const j2m = J2M("mongodb://localhost:27017");

const base = queryBuilder()
  .database('app')
  .collection('Todos');
  
describe('CRUD Pattern', () => {
  it('should be able to insert a document', (done) => {
    const basic_insert = base.insert({
      task_name: 'morning code',
      status: 'to_be_done'
    }).value();
    j2m.exec(basic_insert).then((ret) => {
      console.log(ret.ops);
      done();
    }).catch(console.log)
  });
  
  it('should be able to query a document', (done) => {
    const basic_find = base.find({}).value();
    j2m.exec(basic_find).then((ret) => {
      console.log(ret);
      j2m.close();
      done();
    }).catch(console.log)
  });
});