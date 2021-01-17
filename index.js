const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const User = require('./models').User;
const Score = require('./models').Score;
const Song = require('./models').Song;

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
        res.status(401).send({status: 'ng'});
        return;
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.status(401).send({status: 'ng'});
        return;
    } else {
        console.log(`${req.body.id} is logged in.`);
        res.status(200).send({status: 'ok'});
        return;
    }
});

// get all score
app.get('/userscore/:user_id', (req, res) => {
    console.log(req.params.user_id);
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});

// get all song score
app.get('/score/:sha256', (req, res) => {
    console.log(req.params.sha256);
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});

// get score from user_id + hash
app.get('/userscore/:user_id/:sha256', (req, res) => {
    console.log(req.params.user_id);
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});

// send score
app.post('/score', async (req, res) => {
    console.log(req.headers);
    console.log(req.body);
    let reqSong = await Song.findOne({where: {sha256: req.body.model.sha256} });
    if(!reqSong) {
        // submit song info
        const model = req.body.model;
        reqSong = await Song.create(model);
    }
    // submit score info
    // TODO get user info from session ...
    const user_id = 1;
    const where = {where: {sha256: req.body.model.sha256, user_id: user_id, lntype: req.body.model.lntype}};
    let updateScore = req.body.score;
    let localscore = await Score.findOne(where);
    console.log(localscore);
    if (localscore) { 
        // update score
        console.log("update Score");
        if (calcExScore(localscore) > calcExScore(req.body.score)){
            updateScore = localscore;
        }
        updateScore.user_id = user_id;
        // clear lump update
        if (convertClearType(localscore.clear) < convertClearType(req.body.score.clear)) {
            updateScore.clear = req.body.score.clear;
        } else {
            updateScore.clear = localscore.clear;
        }
        reqScore.update(updateScore, where);
    } else {
        // new score
        console.log("new Score");
        updateScore.user_id = user_id;
        localscore = await Score.create(updateScore);
    }
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
const convertClearType = (clearstr) => {
    switch(clearstr) {
        case 'NoPlay': return 0; 
        case 'Failed': return 1;
        case 'AssistEasy': return 2;
        case 'LightAssistEasy': return 3;
        case 'Easy': return 4;
        case 'Normal': return 5;
        case 'Hard': return 6;
        case 'ExHard': return 7;
        case 'FullCombo': return 8;
        case 'Perfect': return 9;
        case 'Max': return 10;
        default: return 0;
    }
};
const calcExScore = (model) => {
    return 2 * (model.epg + model.lpg) + model.epg + model.lpg;
};


const server = http.createServer(app);
server.listen(port);
module.exports = app;
