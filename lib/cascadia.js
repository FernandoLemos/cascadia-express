//-----------------------------------------------------------------------------
// Requirements/Globals
//-----------------------------------------------------------------------------

var fs = require('fs')
  , _ = require('underscore')

var logActivity = false
  , root
  , map
  , ext;

//-----------------------------------------------------------------------------
// Initialization
//-----------------------------------------------------------------------------

/**
 * Intialize Cascadia and setup the Express middleware
 *
 * @param {Object} opts The cascade object. The object keys correspond to the 
 *                      hostnames of the sites you are serving. The values for 
 *                      these keys are arrays of view directories in the 
 *                      desired cascade order.
 * @param {Express object} app A reference to the Express application.
 * @returns {Function} A middleware function.
 */
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

//-----------------------------------------------------------------------------
// Private
//-----------------------------------------------------------------------------

/**
 * Finds and renders the proper template by traversing the cascade chain and 
 * wrapping the res.render function.
 *
 * @param {Object} req The Express request object
 * @param {Object} res The Express response object
 * @param {Function} next A callback
 */
function middleware (req, res, next) {
  // Save Express' render function
  var render = res.render.bind(res)
   , cascade = map[req.host.trim()];

  if (logActivity && cascade) {
    console.log('CHAIN: ', cascade);
  }

  // Wrap the Express render function
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

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

exports.init = init;
