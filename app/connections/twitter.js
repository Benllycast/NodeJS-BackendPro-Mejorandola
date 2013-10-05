
var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');

var twitterConnection = function (server) {
    console.log('twitterConnections cargado ####');

    // configuracion de la estrategia de conexion
    // las key van en un archivo de configuracion
    passport.use(new TwitterStrategy({
        consumerKey: 'uRjtzD1lEj8tWJIKiTWZA',
        consumerSecret: 'gSYkXe70riHGFRSsk8hXhQI0DKJm3uXTrZKrrQbmvw',
        callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
    }, function (token, tokenSecret, profile, done) {
        // debugger;
        // done(null, profile);
        var user = new User({
            username: profile.username,
            twitter: profile
        });

        user.save( function (err) {
            if (err) {
                done(err, null);
                return;
            }
            done(null, profile);
        });
        // var user = profile;
        // done(null, user);
    }));

    server.get('/auth/twitter', passport.authenticate('twitter'));

    server.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect : '/?error=algo-fallo'}), function (req, res) {
        res.redirect('/app');
    });
};

module.exports = twitterConnection;