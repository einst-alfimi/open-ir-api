const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const http = require('http');
const app = express();
const port = 8000;

app.set('port', port);
app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log('home');
    res.sendStatus(200);
});
app.post('/login', (req, res) => {
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});

app.get('/score/:sha256', (req, res) => {
    console.log(req.params.sha256);
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});
app.post('/score', (req, res) => {
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});
app.get('/course/:sha256', (req, res) => {
    console.log(req.params.sha256);
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});
app.post('/course', (req, res) => {
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});
app.get('/table', (req, res) => {
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});
app.get('/rival', (req, res) => {
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});



const server = http.createServer(app);
server.listen(port);
module.exports = app;
