const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const users = require('./users');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use('/static', express.static(__dirname + '/../client/dist/static'));
app.use('/assets', express.static(__dirname + '/../client/src/assets'));
app.get('/', function(req, res) {
    res.sendFile(path.normalize(__dirname + '/../client/dist/index.html'));
});
app.use('/api', users);

app.listen(3000, function() {
    console.log('Pomodoro Dashboard is running on port 3000');
});
