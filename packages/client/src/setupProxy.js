const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware(
      '/api', {
        target: 'http://localhost:42945',
        pathRewrite: {'^/api': ''},
      }
    )
  );
  app.use(
    createProxyMiddleware(
      '/registry', {
        target: 'http://localhost:8000',
        pathRewrite: {'^/registry': ''}
      }
    )
  );
};
