var React = require('react');
var createAppStore = require('../src/js/redux/createAppStore');
var getRoot = require('../src/js/getRoot');

module.exports = function (app) {
  return app.controller()
    .get('/', function (req, res, next) {
      res.vars.styles = ['/css/app.css'];
      res.vars.scripts = ['/js/vendors.js', '/js/app.js'];

      req.store = createAppStore();
      res.vars.app = React.renderToString(getRoot(req.store));
      res.vars.initialState = JSON.stringify(req.store.getState(), null, 2);

      res.render('app');
    })
};
