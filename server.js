var express = require('express.io'),
    swig = require('swig'),
    _ = require('underscore'),
    passport = require('passport');

var RedisStore = require('connect-redis')(express);

var server = express();
server.http().io();

// cargar archivos staticos
server.use(express.static('./public'));

// configuracion para renderear vista
server.engine('html', swig.renderFile);
server.set('view engine','html');
server.set('views', './app/view')

// agregamos post, cookies y sessiones
server.configure(function () {
    server.use(express.logger());
    server.use(express.cookieParser());
    server.use(express.bodyParser());

    server.use(express.session({
        secret  : "palabrasecreta",
        store   : new RedisStore({}),
        // store   : new RedisStore({
        //     host : conf.redis.host,
        //     port : conf.redis.port,
        //     user : conf.redis.user,
        //     pass : conf.redis.pass
        // }),
    }) );

    // para configurar passport para sessiones
    server.use( passport.initialize() );
    server.use( passport.session() );
});

// funciones para serializar usuarios con passport
passport.serializeUser( function (user, done) {
    done(null, user);
});

passport.deserializeUser( function (obj, done) {
    done(null, obj);
});

// elementos cuasiGlobales
var users = [];

// carga de controladores
var homeController  = require('./app/controllers/home');
var appController   = require('./app/controllers/app');

// implementacion de controladores
homeController(server, users);
appController(server, users);

// Connections
var twitterConnection = require('./app/connections/twitter');
twitterConnection(server);


server.listen(3000);