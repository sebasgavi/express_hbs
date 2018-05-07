const MongoClient = require('mongodb').MongoClient
    ObjectID = require('mongodb').ObjectID,
    express = require('express'),
    engines = require('consolidate');

var app = express(),
    db;

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

app.use(express.static('public'));

// Conectarse a Base de Datos
MongoClient.connect(`mongodb+srv://cluster0-c5bcf.mongodb.net/tienda`, 
    {
        auth: {
            user: 'sgaviria',
            password: 'ContraseñaSuperSegura123'
        }
    },
    function (err, client) {
        if (err) throw err;

        db = client.db('tienda');

        // Iniciar servidor
        app.listen(process.env.PORT || 1234);
    }
);



app.get('/', (req, res) => {
    /*db.collection('productos')
        .find()
        .toArray((err, result) => {
            res.render('index', {
                productos: result
            });
        })*/

    var prod = db.collection('productos')
        .find();
    
    if(req.query.marca)
        prod.filter({ marca: req.query.marca });

    if(req.query.modelo)
        prod.filter({ modelo: req.query.modelo });

    prod.toArray((err, result) => {
            console.log('hola servidor')
            res.render('index', {
                productos: result
            });
        });
});

app.get('/checkout', (req, res) => {
    res.render('checkout');
});


app.get('/producto/:id', (req, res) => {
    db.collection('productos').find({ modelo: req.params.id }).toArray((err, result) => res.send(result))
});


app.get('/productosPorIds', (req, res) => {
    console.log(req.query.ids);
    var arreglo = req.query.ids.split(',');
    arreglo = arreglo.map(function(id) {
        return new ObjectID(id);
    });
    var prod = db.collection('productos')
        .find({ _id: { $in: arreglo } })
        .toArray((err, result) => {
            res.send(result);
        });
});

//