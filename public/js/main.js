$(document).ready(function() {
    window.io = io.connect();
    io.on('connect', function (socket) {
        // body...
        console.log('hi');
        io.emit('hello?');
    });

    io.on('saludo', function (data) {
        //debugger;
        console.log(data);
    });

    io.on('log-in', function (data) {
        //debugger;
        console.log('log IN: '+data.username);
        $('#users').append('<li>'+data.username+'</li>');
    });

    io.on('log-out', function (data) {
        //debugger;
        console.log('log OUT: '+data.username);
        $('#users li').each(function (i, item) {
            if(item.innerText == data.username){
                $(item).remove();
            }
        });
    });

    io.on('post', function (data) {
        // debugger;
        $('#post>ul').append('<li>'+data.user.username+': '+data.post+'</li>')
    });
});