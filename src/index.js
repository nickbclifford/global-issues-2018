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

// turn on server

app.listen(3000, () => {
    console.log('server listening on *:3000');
});
