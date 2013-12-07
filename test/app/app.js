var express = require('express')
  , cascadia = require('../../lib/cascadia')
  , app = express();

var cascade = {
  'base': ['base'],
  'localhost': ['localhost', 'base'],
  'test.example.com': ['test.example.com', 'base'],
  'special-test.example.com': ['special-test.example.com', 'test.example.com', 'base']
};

app.engine('html', require('hogan-engine'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(function (req, res, next) {
  req.headers.host = req.get('X-Mock-Host');
  next();
}); 

app.use(cascadia.init(cascade, app));
app.use(express.urlencoded());
app.use(express.json());
app.use(app.router);

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/base', function (req, res) {
  res.render('base');
});

app.get('/localhost', function (req, res) {
  res.render('localhost');
});

app.get('/test', function (req, res) {
  res.render('test');
});

app.get('/special-test', function (req, res) {
  res.render('special-test');
});

app.use(function(err, req, res, next){
  res.send(404);
});

module.exports = app;