var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.render('index.pug', {title: 'Заголовок', message: 'Сообщение'});
});

app.get('/igor', function (req, res) {
   res.send('Igor');
});

var server = app.listen(3000, function (req, res) {
    var addres = server.address();
    console.log("Server starting: %s:%d;", "127.0.0.1", addres.port);
});


