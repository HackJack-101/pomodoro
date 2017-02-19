const express = require('express');
const router = express.Router();
let ids = 1;

class User {
    constructor(name) {
        this.id = ids++;
        this.name = name;
        this.picture = null;
        this.state = 0;
        this.pomodoroStart = null;
        this.pomodoroDuration = 0;
    }

    getName() {
        return this.name;
    }

    getID() {
        return this.id;
    }

    startPomodoro(duration) {
        this.state = 1;
        this.pomodoroStart = Date.now();
        this.pomodoroDuration = parseInt(duration);
    }

    startBreak(duration, state) {
        this.state = state;
        this.pomodoroStart = Date.now();
        this.pomodoroDuration = parseInt(duration);
    }

    stopPomodoro() {
        this.state = 0;
        this.pomodoroStart = null;
        this.pomodoroDuration = 0;
    }

    toString() {
        return 'User(id:' + this.id + '; name:' + this.name + ')';
    }
}

let users = [];

router.get('/', function(req, res) {
    res.send('Hello World!');
});

router.get('/users', function(req, res) {
    res.json(users);
});

router.post('/user', function(req, res) {
    if (req.body.name.length > 0) {
        users.push(new User(req.body.name));
    }
    res.json(users);
});

router.post('/start', function(req, res) {
    console.log(users);
    let user = users.filter((user) => {
        return user.getID() === req.body.id;
    });
    user = user[0];
    user.startPomodoro(req.body.duration);
    res.json(users);
});

router.post('/break', function(req, res) {
    let user = users.filter((user) => {
        return user.getID() === req.body.id;
    });
    user = user[0];
    user.startBreak(req.body.duration, req.body.state);
    res.json(users);
});

router.post('/stop', function(req, res) {
    let user = users.filter((user) => {
        return user.getID() === req.body.id;
    })[0];
    user.stopPomodoro();
    res.json(users);
});

module.exports = router;
