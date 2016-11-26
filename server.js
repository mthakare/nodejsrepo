var Express = require('express');
var Bp = require('body-parser');
var _ = require('underscore');

var app = Express();


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
    tasks.push(data);
    res.send(tasks);
    
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

app.delete('/delete/:id', function (req, res) {
    var matchedRequest;
    var paramid = parseInt(req.params.id, 10);


    var matchedRequest = _.findWhere(tasks, {
        id: paramid
    });

    if (matchedRequest) {
        tasks = _.without(tasks, matchedRequest); 
        res.json(matchedRequest);
    } else {
        res.status(404).send();
    }

});


app.listen(3000, function () {
    console.log('app is running in port 3000');
});