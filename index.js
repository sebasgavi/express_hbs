const express = require('express'),
      consolidate = require('consolidate'),
      hbs = require('handlebars');

var app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static('public'));

// req: http request
// res: http response
app.get('/', function (req, res) {
    res.render('index', {
        titulo: 'Hola',
        personas: [
            'Sebastián',
            'Sofía',
            'Alberto'
        ],
        carros: [
            {
                nombre: 'Aveo',
                llantas: 4,
                cilindraje: 1.2,
            },
            {
                nombre: 'Slingshot',
                llantas: 3,
                cilindraje: 1.4
            }
        ]
    });
});

app.get('/personas', (req, res) => {
    res.render('personas', {
        texto: 'hola'
    });
});

app.listen(3000, function(){
    console.log('listo!');
});