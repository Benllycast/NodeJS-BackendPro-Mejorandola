var express = require('express');
var server = express();

var messages = [];
var responses = [];
//forma de responder a una peticion
server.get('/', function (req, res) {
    debugger;
    res.send("hello word");
} );

server.get('/supervisor', function (req, res) {
    res.send("supervisor funciona");
})

server.get('/messages', function (req, res) {
    //tu puedes guardar todas las respuestas a peticiones que hallan echo para utilizarlas posteriormente
    responses.push(res)
    // res.send(messages+'<script>setTimeout(function(){window.location.reload()}, 1000)</script>');
});

//recivir parametros por el path de la url
server.get('/messages/:message', function (req, res) {
    messages.push(req.params.message);
    
    responses.forEach(function (res) {
        res.send(messages + '<script>window.location.reload();</script>');
    });
    res.send("tu mensaje es: "+req.params.message);
});

//iniciar un server con express
server.listen(3000);
console.log("Escuchando en :3000");