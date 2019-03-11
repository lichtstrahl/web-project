const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const stdHead = {'Content-Type':'text/html'};
const countRequest = 0;
// Массив котов. У каждого кота должно быть id, имя и возраст
var cats = [];

const isCat = function (x) {
   return x.id && x.name && x.age;
};

const isValidIDCat = function (id) {
   return id >= 0 && id < cats.length;
};

const searchIndexForID = function (id) {
   index = - 1;
   for (var i = 0; i < cats.length; i++)
      if (cats[i].id == id)
         index = i;
   return index;
}

app.use(express.static('static'));
app.use(bodyParser.json());
// Функция, которая отдаёт index.html
var functionIndex = function (req, res) {
    fs.readFile('./static/html/index.html', 'utf8', function (err, data) {
        if (err) {
            console.log('Файл не найден или не может быть открыт.');
        } else {
            res.writeHead(200, stdHead);
            res.end(data);
        }
    });
};

var functionHack = function (req, res) {
     fs.readFile('./static/html/hack.txt', 'utf8', function (err, data) {
         if (err) {
             console.log('Файл не найден или не может быть открыт.');
         } else {
             res.writeHead(200, stdHead);
             res.end(data);
         }
     });
};

var printCat = function(cat) {
  var result = "";
  if (isCat(cat)) {
     result += "\n-------";
     result += "\nid: " + cat.id;
     result += "\nname: " + cat.name;
     result += "\nage: " + cat.age;
     result += "\n------";
  } else {
     result += "\nНе кот";
  }

  return result;
};

var getCats = function (req, res) {
   str = "Всего котов: " + cats.length;
   console.log("SIZE: ", cats.length);
   for (var i = 0; i < cats.length; i++) {
      str += "\n" + printCat(cats[i], res);
    }
   res.send(str);
};

var postCat = function (req, res) {
   var newCat = {
      "id" : cats.length+1,
       "name" : req.body.name,
       "age" : req.body.age
   };
   if (isCat(newCat)) {
      cats[cats.length] = newCat;
      res.send("Кот успешно добавлен. Его id: " + newCat.id);
   } else {
      res.send("Не удалось добавить. Вы прислали не кота.")
   }
};

var putCat = function (req, res) {
   var index = searchIndexForID(req.params.id);
    if (isValidIDCat(index)) {
        if (req.body.name && req.body.age) {
            cats[index] = {
                "id" : req.params.id,
                "name" : req.body.name,
                "age" : req.body.age
            };
            res.send("Кот под номером (" + req.params.id + ") успешно изменён");
        } else {
            res.send("Некорректные параметры.");
        }
    } else {
       res.send("Не удалось найти id (" + req.params.id + ")");
    }
};

var deleteCat = function (req, res) {
   var index = searchIndexForID(req.params.id);
   if (isValidIDCat(index)) {
      cats.splice(index, 1);
      res.send("Кот (" + req.params.id + ") успешно удалён.");
   } else {
      res.send("Не удалось найти кота (" + req.params.id + ")");
   }
}

// GET - запрос на главную страницу
app.get('/', functionHack);
// GET - зпрос на /hack
app.get('/hack', functionIndex);
// GET - запрос чтобы получить котов
app.get('/cats', getCats);
// POST - запрос на добавление нового кота
app.post('/cats', postCat);
// PUT - запрос на добавление нового кота по ID
app.put('/cats/:id', putCat);
// DELETE - запрос на удаление кота по ID
app.delete('/cats/:id', deleteCat);

// OPTION - запрос на корень
app.options('/', function (req, res) {
   res.setHeader('Allow', 'GET, POST, OPTION, DELETE, PUT');
   res.send();
});

var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Listening https://%s:%s", host, port);
});

console.log("Server running ...");