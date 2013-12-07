var fs = require('fs')
  , _ = require('underscore')

var logActivity = false
  , root
  , map
  , ext;

function init (opts, app) {
  if (!opts) {
    throw new Error('A cascade chain must be passed to the cascadia\'s init function.');
  }

  if (opts.logActivity) {
    logActivity = true;
    delete opts.logActivity;
  }

  map = opts;
  root = app.settings.views;
  ext = app.settings['view engine'];

  return middleware;
}

function middleware (req, res, next) {
  var render = res.render.bind(res)
   , cascade = map[req.host.trim()];

  if (logActivity && cascade) {
    console.log('CHAIN: ', cascade);
  }

  res.render = function (path, options, fn) {
    var dir = _.find(cascade, function (directory) {
      var file = [root, directory, path].join('/') + '.' + ext;

      if (logActivity) {
        console.log('LOOKING AT: %s', file);
      }

      return fs.existsSync(file);
    });

    if (dir) {
      if (logActivity) {
        console.log('FOUND IN: %s', dir);
      }
      path = [dir, path].join('/');
    }

    render(path, options, fn);
  }

  next();
}

exports.init = init;
