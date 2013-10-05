var _ = require('underscore');


var homeController = function (server, users) {
    console.log('homeController cargado ####');

    //middleware para el manejo de sessiones
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
        // debugger;
        // verificar que las session de passport exista
        if(req.session.passport.user){
            res.redirect('/app');
            return
        }

        next();
    };

    server.get('/', isLoggedIn ,function (req, res) {
        res.render('home'); 
    });
       
    server.get('/log-out', function (req, res) {
        users = _.without(users, req.session.user);

        server.io.broadcast('log-out',{ username : req.session.user});
        req.session.destroy();
        res.redirect('/');
    });


    server.post('/log-in', function (req, res) {
        users.push(req.body.username)
        console.log(req.body.username)
        req.session.user = req.body.username;

        server.io.broadcast('log-in',{ username : req.session.user});
        res.redirect('/app')
    });

};

module.exports = homeController;
