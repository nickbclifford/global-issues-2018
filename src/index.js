const path = require('path');

const express = require('express');
const app = express();

// set up express

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', express.static(path.join(__dirname, 'public')));

// routes

// noinspection JSUnresolvedFunction
app.get('/', (req, res) => {
    res.render('index');
});

// noinspection JSUnresolvedFunction
app.get('/game', (req, res) => {
	res.render('game');
});

// noinspection JSUnresolvedFunction
app.get('/tutorial', (req, res) => {
	res.render('tutorial');
});

// noinspection JSUnresolvedFunction
app.get('/success', (req, res) => {
	res.render('success');
});

// noinspection JSUnresolvedFunction
app.get('/bibliography', (req, res) => {
	res.render('bibliography');
});

// turn on server

app.listen(2200, () => {
    console.log('server listening on *:2200');
});
