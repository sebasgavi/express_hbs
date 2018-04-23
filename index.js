const MongoClient = require('mongodb').MongoClient,
    express = require('express'),
    engines = require('consolidate'),
    fs = require('fs');

var app = express(),
    db;

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    if (err) throw err;

    db = client.db('test');
    var server = app.listen(1234);

    /*db.collection('countries').ensureIndex('name.common', {
        unique: true
    });*/
});

app.get('/', function (req, res) {
    db.collection('countries')
        .find({
            area: {
                $gte: 47,
                $lt: 91
            }
        }, {
            projection: {
                area: 1,
                'name.common': 1,
                _id: 0
            },
            limit: 100,
            sort: {
                area: 1
            }
        })
        .toArray(function (err, result) {
            res.render('countries', {
                title: 'Paises con área mayor o igual a 47 y menor a 91',
                countries: result
            });
        });
});

app.get('/nuevo_pais', (req, res) => {
    var pais = {
        area: parseInt(req.query.area),
        name: {
            common: req.query.name
        }
    };
    db.collection('countries')
        .insertOne(pais, (err, result) => {
            if(err){
                res.send(err);
            }else{
                res.send(result);
            }
            //res.send(err ? err : result);
        });
});

app.get('/eliminar_pais/:name', (req, res) => {
    db.collection('countries')
        .deleteMany({
            'name.common': req.params.name
        }, (err, result) => res.send(result));
});