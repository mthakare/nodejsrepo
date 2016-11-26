var Express = require('express');
var Bp = require('body-parser');
var _ = require('underscore');

var MongoClient = require('mongodb').MongoClient

var app = Express();

var db;
MongoClient.connect('mongodb://admin:admin@ds111188.mlab.com:11188/maydb', (err, database) => {
    if (err) {
        return console.log(err);
    }
    db = database;
});

app.use(Express.static('public'));
app.use(Bp.json());

var tasks = []
var taskId = 1; 

app.get('/getmytasks', function(req, res) {
    res.json(tasks);
});

app.post('/postmytask', function (req, res) {
    var data = req.body;
    data.id = taskId++;
    db.collection('userdb').save(data, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.status(200).send();
    })
    
});

app.get('/getmytask/:id', function (req, res) {
    var matchedRequest;
    var paramid = parseInt(req.params.id, 10);


    var matchedRequest = _.findWhere(tasks, {
        id: paramid
    });

    if (matchedRequest) {
        res.json(matchedRequest);
    } else {
        res.status(404).send();
    }

});

app.delete('/delete', function (req, res) {
   db.collection('userdb').findOneAndDelete({description : req.body.description}, (error, result) => {
       if (error) return res.send(500, err);
       res.send(result);
   })
  
});

app.put('/update', (req, res) => {
    db.collection('userdb').findOneAndUpdate({description: req.body.description}, {
        $set : {
            description : req.body.description,
            completed : req.body.completed
        },

    }, {
        sort : {_id : -1},
        upsert : true
    }, (error, result) => {
        if (error) return res.send(error);
        res.send(result)
    })
})

app.listen(3000, function () {
    console.log('app is running in port 3000');
});