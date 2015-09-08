//  app/routes.js

//  =============================================================================
//  SET UP AND GLOBAL VARIABLES
//  =============================================================================

var core                                  = require('./core.js');

//  =============================================================================
//  ROUTES
//  =============================================================================

  module.exports = function(app) {

    // allows for cross browser communication
    app.all( '/*', function(req, res, next) {

      // console.log( "HEADER: ", req.headers );
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      // res.setHeader('Access-Control-Allow-Credentials', false);

      next();
    });

    // landing page to site loads default - login.ejs
    app.get('/', core.main);

    // landing page to site loads default - login.ejs
    app.get('/hello', core.hello);

    // send any unknown directory to the 404 page!
    app.get('*', function(req, res){
      res.render('./partials/404.ejs');
    });

  };
