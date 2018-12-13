const chai = require('chai')
const should = chai.should(),
  expect = chai.expect;

const j2m = require('../src/index.js');
var queryBuilder = require('../querybuilder');

let conn;

describe('connection', () => {
  it('wait until the mongodb get up and connect to it', (done) => {
    j2m.connect().then((connection) => {
      conn = connection;
    }).finally(done);
  }).timeout(10000);
})

describe('create ops', () => {
  it('insert one', (done) => {
    if(!conn) this.skip();
    try { 
      const item1 = queryBuilder()
        .database('app')
        .collection('Todos')
        .insertOne({
          title: 'temp List',
          quantity: 10,
          completed: true,
        });

      j2m.input(item1) // item1.getPayload() is implicit
        .then((res) => {
          expect(res.error).to.be.null;
          expect(res.response);
          should.exist(res.response);
          expect(res.request.title).be.equal('temp List');
          expect(res.response.title).be.equal('temp List');
        })
        .catch(err => {
          console.log('Error is occured', err);
        }).finally(done);
    } catch(err) {
      conn.close(function () {
        done(err);
      });
    }
  });
});
