var express = require('express'),
  swig = require('swig');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var session = require('express-session');
var redisStore = require('connect-redis')(session);
var settings = require('./settings');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('html', swig.renderFile)
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
// Swig will cache templates for you, 
// but you can disable that and use Express's caching instead, 
// if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({cache: false});

app.enable('trust proxy');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'kenneth',
  store: new redisStore({
    host: settings.redis.host
  })
}));

app.use('/', routes);
app.use('/users', users);

app.locals.moment = require('moment');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
