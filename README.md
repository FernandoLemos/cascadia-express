```js
var express = require('express')
  , cascadia = require('cascadia-express')
  , app = express();

/**
 * This is the cascade object map. The keys in this object are hostnames and
 * the values are arrays of view directories in the desired cascade order. 
 * In this example we have the following application structure:
 *
 *    |── views
 *    |   |── base
 *    |   |   |── landing.html
 *    |   |   └── home.html
 *    |   |── test.example.com
 *    |   |   └── home.html
 *    |   └── special-test.example.com
 *    |   |   └── home.html
 *    |── ...
 *    └── index.js
 *
 * As you can see below, we have two routes setup to render the `home.html` and
 * the `landing.html` templates.
 *
 * If a request comes in at `test.example.com/`, cascadia will follow the
 * test.example.com cascade chain until it finds the 'home.html' template.
 * First it will look in /views/test.example.com, then in `/views/base`. In this
 * case `home.html` would be found in `/views/test.example.com` and would stop
 * looking.
 *
 * If a request comes in a `test.example.com/landing`, cascadia will follow the
 * same cascade chain, but this time will not find the `landing.html` template
 * until it looks in `/views/base`.
 */

var cascade = {
  'test.example.com': ['test.example.com', 'base'],
  'special-test.example.com': ['special-test.example.com', 'test.example.com', 'base']
};

app.engine('html', require('hogan-engine'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(cascadia.init(cascade, app));

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/landing', function (req, res) {
  res.render('landing');
});
```