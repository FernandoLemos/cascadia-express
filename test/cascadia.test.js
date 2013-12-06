var app = require('./app/app')
  , expect = require('expect.js')
  , request = require('supertest')(app);

describe('cascadia-express', function () {
  it('should cascade to the top level', function (done) {
    request.get('/').set('X-Mock-Host', 'base').end(function (err, res) {
      if (err) return done(err);
      expect(res.text).to.be('base/index.html');
      done();
    });
  });
});