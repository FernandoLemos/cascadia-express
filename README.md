# Cascadia

Cascadia is a cascading template system for Express. Cascadia allows you to share templates between different domains, making white-labeling websites easy and flexible.

## Installation and Getting Started

```bash
$ npm install cascadia-express
```

Once you've installed `cascadia-express`, you'll need to integrate it into your Express application.

First, you'll need to create a cascade map. The cascade map has the keys that correspond to the hostnames of the sites you are serving. The values for these keys are arrays of view directories in the desired cascade order. For example, consider the following Express app structure:

```
  |── views
  |   |── base
  |   |   |── landing.html
  |   |   └── home.html
  |   |── test.example.com
  |   |   └── home.html
  |   └── special-test.example.com
  |       └── home.html
  |── ...
  └── index.js
```

In this example we are serving `test.example.com` and `special-test.example.com`. For this example we might create the following cascade map:

```js
var cascade = {
  'test.example.com': ['test.example.com', 'base'],
  'special-test.example.com': ['special-test.example.com', 'test.example.com', 'base']
};
```

This object tells Cascadia that for requests coming in at `test.example.com`, it should first look in `/views/test.example.com` for a given template, then in `/views/base`. For request coming in at `special-test.example.com`, it will look in `/views/special-test.example.com`, then `/views/test.example.com`, then `/views/base`.

Once you've settled on a cascade chain for each of your hostnames, you will need to call `cascadia.init`:

```js
app.use(cascadia.init(cascade, app));
```

In your routes you will just call `res.render` as you normally would:

```js
app.get('/', function (req, res) {
  res.render('home');
});
```

Putting it all together, here's a full example:

```js
var express = require('express')
  
  // Add the requirement.
  , cascadia = require('cascadia-express')
  , app = express();

// Setup the cascade object. Cascadia will search like so:
//
//  REQ test.example.com, res.render(<template>);
//      |–– CHECK /views/test.example.com/<template>
//      └── CHECK /views/base/<template>
//
//  REQ special-test.example.com, res.render(<template>);
//      |–– CHECK /views/special-test.example.com/<template>
//      |–– CHECK /views/test.example.com/<template>
//      └── CHECK /views/base/<template>
var cascade = {
  'test.example.com': ['test.example.com', 'base'],
  'special-test.example.com': ['special-test.example.com', 'test.example.com', 'base']
};

app.engine('html', require('hogan-engine'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Initialize the middleware by calling cascadia.init and passing in the
// cascade and the app.
app.use(cascadia.init(cascade, app));

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/landing', function (req, res) {
  res.render('landing');
});
```
