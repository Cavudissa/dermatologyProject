'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
const hbs = require('hbs')
var app = module.exports = loopback();
const path = require('path');
var bodyParser = require('body-parser');
const UtilsService = require('./Services/utils_service.js')
var http = require('http');
var https = require('https');
var sslConfig = require('./ssl-config');
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname,path.join("views","partials")))



app.use(['/administrative','/patient','/doctor','/nurse'],function(req,res,next){
    var url = req.baseUrl.split('/')[1]
    if(!req.query.accessToken){
      res.redirect('/home')
    }else{
      const utilsService = new UtilsService(app)
      utilsService.verifyRole(req.query.accessToken,(err,result)=>{
        if(err)res.status(401).send({msg: 'Please Login'})
        if(url!=result.role){
          res.status(401).send({msg: 'No permission...'})
        }
        next()
      })
    }
  }
)

app.get('/home', (req, res, next) => {
    res.render('homeView.hbs');
});

app.start = function(httpOnly) {
  if (httpOnly === undefined) {
    httpOnly = process.env.HTTP;
  }
  var server = null;
  if (!httpOnly) {
    var options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate,
    };
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }
  server.listen(app.get('port'), function() {
    var baseUrl = (httpOnly ? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');
    app.emit('started', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
  return server;
};


// catch 404 and forward to error handler

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if(err.status){
    res.locals.message = err.message
  }
  else {
    res.locals.message = "We are sorry. There has been a problem with our servers."
  }
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  var status =err.status || 500;
  res.render('errorView',{code:status,msg:res.locals.message})
});
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
