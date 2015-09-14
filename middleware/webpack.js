if (process.env.NODE_ENV === 'development') {
  var webpack = require('webpack');
  var config = require('../webpack.config')({development: true});
  var compiler = webpack(config);
  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  });
  var hotMiddleware = require('webpack-hot-middleware')(compiler);

  module.exports = function (app) {
    return function (req, res, next) {
      req.path = req.path || req.url; // A compatibility hack (for express?)
      devMiddleware(req, res, function (err) {
        if (err) return next(err);
        hotMiddleware(req, res, function (err) {
          if (err) return next(err);
          next();
        });
      })
    };
  };
} else {
  module.exports = function (app) {
    return function (req, res, next) {
      next();
    }
  }
}
module.exports.weight = -9999;
