var User = require('../models/user');
var Post = require('../models/post');
var _ = require('underscore');

var appController = function (server, users) {
    console.log('appController cargado ####');

    // comprobacion de sessiones
    var isNotLoggedIn = function (req, res, next) {
        // debugger;
        // verificar que las session de passport exista
        if(!req.session.passport.user){
            res.redirect('/');
            return;
        }
        next();
    };

    var isLoggedIn = function (req, res, next) {
        // verificar si ya se logeo con passport
        if(req.session.passport.user){
            res.redirect('/app');
            return;
        }

        next();
    };

    var getUser = function (req, res, next) {
        var userName = req.session.passport.user.username;
        var user = User.findOne({ username: userName }, function(err, user) {
            // debugger;

            req.user = user;
            next();
        });
    };
    // implementacion del middleware de sessiones
    server.get('/app', isNotLoggedIn, function (req, res) {
        //debugger;

        Post.find({})
        .populate('user')
        .exec( function (err, posts) {

            var postAsJSON = _.map( posts, function ( post ) {
                return post.toJSON();
            });

            // debugger;
            res.render('app', {
                user : req.session.passport.user,
                users: users,
                posts: postAsJSON
            });
        });
        
    });

    server.post('/app/create-post', isNotLoggedIn, getUser, function (req, res) {
        // debugger;
        var post = new Post({
            content: req.body.content,
            user: req.user
        });

        post.save(function(err) {
            // debugger;
            
            if(err){
                res.send(500, err);
            }

            server.io.broadcast('post', {
                post: post.content,
                user: req.user.toJSON()
            });

            res.redirect('/app');
        });
        
    });

    server.io.route('hello?', function (req, res) {
        //debugger;
        req.io.emit('saludo',{
            message: 'serverReady'
        })
    });
};

module.exports = appController;