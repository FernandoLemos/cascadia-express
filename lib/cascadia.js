var fs = require('fs')
  , _ = require('underscore')

var root
  , map
  , ext;

function init (opts, app) {
  map = opts;
  root = app.settings.views;
  ext = app.settings['view engine'];

  return middleware;
}

function middleware (req, res, next) {
  var render = res.render.bind(res)
   , cascade = map[req.host.trim()];

  res.render = function (path, options, fn) {
    var dir = _.find(cascade, function (directory) {
      return fs.existsSync(
        [root, directory, path].join('/') + '.' + ext
      );
    });

    if (dir) {
      path = [dir, path].join('/');
    }

    render(path, options, fn);
  }

  next();
}

exports.init = init;
