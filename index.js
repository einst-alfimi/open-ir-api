const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const User = require('./models').User;

const http = require('http');
const app = express();
const port = 8000;

app.set('port', port);
app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log('home');
    res.sendStatus(200);
});
app.post('/login', async (req, res) => {
    const user = await User.findOne({where: {name: req.body.id} });
    if (!user) {
        console.log("id ng");
        res.status(401).send({status: 'ng'});
        return;
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        console.log("password NG");
        res.status(401).send({status: 'ng'});
        return;
    } else {
        console.log(`${req.body.id} is logged in.`);
        res.status(200).send({status: 'ok'});
        return;
    }
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
