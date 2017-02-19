const express = require('express');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const users = require('./users');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(history());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/api', users);

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
