const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const Memcached = require('memcached');
const memcached = new Memcached("localhost"); // TODO

const crypto = require('crypto');

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
        const token = getSession();
        memcached.add(token, req.body.id, 1800, (err) => { /* stuff */ });
        res.status(200).send({status: 'ok', accessToken: token});
        return;
    }
});

// get all score
app.get('/userscore/:user_id', async (req, res) => {
    console.log("find score by user_id");
    const scores = Score.findAll({where: {user_id: req.params.user_id}});
    res.status(200).send(scores);
});

// get all song score by lntype
app.get('/score/:sha256/:lntype', async (req, res) => {
    console.log("find score by sha256");
    let loggedInUserId = "";
    memcached.get(req.header('accessToken'), (err, data) => {
        memcached.touch(req.header('accessToken'), 1800);
        loggedInUserId = data; // session check
    });

    const scores = await Score.findAll({where: req.params, include: User, row: true});
    const response = scores.map((item) => {
        let newItem = item.dataValues;
        // if login user score, remove player name.
        newItem.player = item.User.name === loggedInUserId ? "" : item.User.name;
        newItem.clear = convertClearType(newItem.clear);
        delete newItem.User;
        return newItem;
    });
    res.status(200).send(response);
});

// get score from user_id + hash
app.get('/userscore/:user_id/:sha256', async (req, res) => {
    console.log("find score by sha256 and user_id");
    const scores = await Score.findAll({where: {user_id: req.params.user_id, sha256: req.params.sha256}});
    const response = scores.map((item) => {
        let newItem = item.dataValues;
        newItem.player = item.User.name;
        delete newItem.User;
        return newItem;
    });
    res.status(200).send(scores);
});

// send score
app.post('/score', async (req, res) => {
    console.log("submit score");
    console.log(req.body.playCount);

    // console.log(req.headers);
    // console.log(req.body);
    let reqSong = await Song.findOne({where: {sha256: req.body.model.sha256} });
    if(!reqSong) {
        console.log("submit song info");
        const model = req.body.model;
        reqSong = await Song.create(model);
    }
    // submit score info
    // TODO get user info from session ...
    const user_id = 1;
    const lntype = req.body.model.hasUndefinedLN ? req.body.model.lntype : 0;
    const where = {where: {sha256: req.body.model.sha256, user_id, lntype}};
    let updateScore = req.body.score;
    updateScore.lntype = lntype;
    let localscore = await Score.findOne(where);
    if (localscore) { 
        console.log("update Score");
        let hasUpdate = true;
        if (calcExScore(localscore) > calcExScore(req.body.score)){
            updateScore = localscore;
            hasUpdate = false;
        } 
        updateScore.user_id = user_id;
        // clear lump update
        if (convertClearType(localscore.clear) < convertClearType(req.body.score.clear)) {
            updateScore.clear = req.body.score.clear; // 更新したとき
            hasUpdate = true;
        } else {
            updateScore.clear = localscore.clear; // 現状のが良いとき
            hasUpdate = hasUpdate ?? false;
        }
        if(hasUpdate) {
            console.log("has update.");
            localscore.update(updateScore, where);
        } else {
            console.log("has no update.");
        }
    } else {
        // new score
        console.log("create new Score");
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

const getSession = () => {
    const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N=16;
    return Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n)=>S[n%S.length]).join('');
}


const server = http.createServer(app);
server.listen(port);
module.exports = app;
