var app = require('./app/app')
  , expect = require('expect.js')
  , request = require('supertest')(app);

describe('cascadia-express', function () {

  it('should cascade to the top level', function (done) {
    request.get('/').set('X-Mock-Host', 'base').end(function (err, res) {
      if (err) return done(err);
      expect(res.text).to.be('base/home.html');
      done();
    });
  });

  it('should cascade one level down', function (done) {
    request.get('/base').set('X-Mock-Host', 'localhost').end(function (err, res) {
      if (err) return done(err);
      expect(res.text).to.be('base/base.html');
      done();
    });
  });

  it('should cascade two levels down', function (done) {
    request.get('/base').set('X-Mock-Host', 'special-test.example.com').end(function (err, res) {
      if (err) return done(err);
      expect(res.text).to.be('base/base.html');
      done();
    });
  });

  it('should find the top-most template', function (done) {
    request.get('/').set('X-Mock-Host', 'test.example.com').end(function (err, res) {
      if (err) return done(err);
      expect(res.text).to.be('test.example.com/home.html');
      done();
    });
  });

  it('should error if the template is not in the cascade chain', function (done) {
    request.get('/localhost').set('X-Mock-Host', 'test.example.com').expect(404, done);
  });

});