const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const util = require('util');

const Memcached = require('memcached');
const memcached = new Memcached("localhost"); // TODO

const bcrypt = require('bcrypt');
const User = require('./models').User;
const Score = require('./models').Score;
const Song = require('./models').Song;
const Rival = require('./models').Rival;
const Course = require('./models').Course;

const strUtil = require('./util/str');

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
        console.log(req.header('apiToken'));
        console.log(req.header('jarToken'));
        const token = strUtil.randomStr();
        memcached.add(token, {id: req.body.id, unique: user.unique}, 1800, (err) => { /* stuff */ });
        res.status(200).send({status: 'ok', accessToken: token, unique: user.unique});
        return;
    }
});

// get all score
app.get('/userscore/:unique', async (req, res) => {
    console.log("find score by user.unique");
    const scores = await Score.findAll({where: {"$User.unique$": req.params.unique}, include: User, row: true});
    res.status(200).send(scores.map((item) => {
        const newItem = item.dataValues;
        // newItem.player = ""; 
        newItem.player = item.User.display; // IDなのか？
        // newItem.player = item.User.unique; 
        newItem.mode = item.lntype;
        delete newItem.User;
        return newItem;
    }));
});

// get all song score by lntype
app.get('/score/:sha256/:lntype', async (req, res) => {
    console.log("find score by sha256");
    const memcachedGet = util.promisify(memcached.get).bind(memcached);
    const loggedInUser = await memcachedGet(req.header('accessToken'));
    const scores = await Score.findAll({where: req.params, include: User, row: true});
    const response = scores.map((item) => {
        let newItem = item.dataValues;
        // if login user score, remove player name.
        // TODO これはClientで対応したほうがいいかも
        newItem.player = item.User.unique === loggedInUser.unique ? "" : item.User.display;
        newItem.mode = item.lntype;
        delete newItem.User;
        return newItem;
    });
    response.sort((a,b) => {
        if( (a.egr + a.lgr) + (a.epg + a.lpg) * 2 > (b.egr + b.lgr) + (b.epg + b.lpg) * 2 ) return -1;
        if( (a.egr + a.lgr) + (a.epg + a.lpg) * 2 < (b.egr + b.lgr) + (b.epg + b.lpg) * 2 ) return 1; 
        if( Date.parse(a.scoreUpdatedAt) < Date.parse(b.scoreUpdatedAt)) return -1;
        if( Date.parse(a.scoreUpdatedAt) > Date.parse(b.scoreUpdatedAt)) return 1;
        return 0;
    });
    res.status(200).send(response);
});

// get score from user_id + hash
app.get('/userscore/:user_id/:sha256', async (req, res) => {
    console.log("find score by sha256 and user_id");
    const scores = await Score.findAll({where: {user_id: req.params.user_id, sha256: req.params.sha256}});
    const response = scores.map((item) => {
        let newItem = item.dataValues;
        // newItem.player = item.User.name;
        newItem.player = ""; // 

        delete newItem.User;
        return newItem;
    });
    res.status(200).send(scores);
});

// send score
app.post('/score', async (req, res) => {
    console.log("submit score");

    const memcachedGet = util.promisify(memcached.get).bind(memcached);
    const loggedInUser = await memcachedGet(req.header('accessToken'));
    if (!loggedInUser) {
        console.warn("no login with push score.");
        res.status(401).send({status: 'ng, you need login.'});
        return ;
    }
    console.log("submit score");

    memcached.touch(req.header('accessToken'));

    console.log(req.body.playCount);
    let reqSong = await Song.findOne({where: {sha256: req.body.model.sha256} });
    if(!reqSong) {
        console.log("submit song info");
        const model = req.body.model;
        reqSong = await Song.create(model);
    }
    // submit score info
    const user = await User.findOne({where: {unique: loggedInUser.unique} });
    const lntype = req.body.model.hasUndefinedLN ? req.body.model.lntype : 0;
    const where = {where: {sha256: req.body.model.sha256, user_id: user.id, lntype}};
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
        updateScore.user_id = user.id;
        // clear lump update, requestはnumberにコンバート
        if (localscore.clear < convertClearType(req.body.score.clear)) {
            updateScore.clear = convertClearType(req.body.score.clear); // 更新したとき
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
        updateScore.user_id = user.id;
        updateScore.clear = convertClearType(updateScore.clear);
        localscore = await Score.create(updateScore);
    }
    res.status(200).send({status: 'ok'});
});
app.get('/course/:sha256/:lntype', (req, res) => {
    console.log(req.params.sha256);
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});
app.post('/course', async (req, res) => {
    console.log("submit course score");

    const memcachedGet = util.promisify(memcached.get).bind(memcached);
    const loggedInUser = await memcachedGet(req.header('accessToken'));
    if (!loggedInUser) {
        console.warn("no login with push score.");
        res.status(401).send({status: 'ng, you need login.'});
        return ;
    }
    memcached.touch(req.header('accessToken'));

    let reqCourse = await Course.findOne({where: {sha256: req.body.sha256} });
    if(!reqCourse) {
        console.log("submit course song info");
        const model = {};
        model.name = req.body.model.name;
        model.sha256 = req.body.sha256;
        model.song1sha256 = req.body.chartSha256[0];
        if (req.body.chartSha256[1]) {model.song2sha256 = req.body.chartSha256[1];}
        if (req.body.chartSha256[2]) {model.song2sha256 = req.body.chartSha256[2];}
        if (req.body.chartSha256[3]) {model.song2sha256 = req.body.chartSha256[3];}
        if (req.body.chartSha256[4]) {model.song2sha256 = req.body.chartSha256[4];}
        req.body.model.constraint.forEach(element => {
            switch(element){
                case 'CLASS': model.type = element; break
                case 'MIRROR': model.type = element; break
                case 'RANDOM': model.type = element; break 
                case 'GAUGE_LR2': model.gauge = element; break
                case 'GAUGE_5KEYS': model.gauge = element; break
                case 'GAUGE_7KEYS': model.gauge = element; break
                case 'GAUGE_9KEYS': model.gauge = element; break
                case 'GAUGE_24KEYS': model.gauge = element; break
                case 'LN': model.ln = element; break
                case 'CN': model.ln = element; break
                case 'HCN': model.ln = element; break
                case 'NO_SPEED': model.speed = element; break
                case 'NO_GOOD': model.judge = element; break
                case 'NO_GREAT': model.judge = element; break
            }
        });
        reqCourse = await Course.create(model);
    }
    // submit score info
    const user = await User.findOne({where: {unique: loggedInUser.unique} });
    const lntype = req.body.model.lntype; // コースはこれだけでいいはず
    const where = {where: {sha256: req.body.sha256, user_id: user.id, lntype}};
    let updateScore = req.body.score;
    updateScore.lntype = lntype;
    updateScore.sha256 = req.body.sha256;
    updateScore.scoretype = 1; 
    let localscore = await Score.findOne(where);
    if (localscore) { 
        console.log("update Score");
        let hasUpdate = true;
        if (calcExScore(localscore) > calcExScore(req.body.score)){
            updateScore = localscore;
            hasUpdate = false;
        } else {
            updateScore.scoreUpdatedAt = new Date(); // スコア更新ある場合のみ日付アップデート
        }
        updateScore.user_id = user.id;
        // clear lump update, requestはnumberにコンバート
        if (localscore.clear < convertClearType(req.body.score.clear)) {
            updateScore.clear = convertClearType(req.body.score.clear); // 更新したとき
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
        updateScore.user_id = user.id;
        updateScore.clear = convertClearType(updateScore.clear);
        localscore = await Score.create(updateScore);
    }
    res.status(200).send({status: 'ok'});
});
app.get('/table', (req, res) => {
    console.log(req.body);
    res.status(200).send({status: 'ok'});
});
app.get('/rival/:unique', async (req, res) => {
    console.log("get rival :" + req.params.unique);
    // TODO hasManyやらつかった方法があるかもしれん User-rival-Userのコネクションの作り方がわからん
    const user = await User.findOne({where: {unique: req.params.unique} });
    const rivals = await Rival.findAll({where: {user_id: user.id}, include: User, row: true});
    const response = rivals.map((item) => {
        const newItem = {
            id: item.User.unique,
            name: item.User.display
        };
        return newItem;
    });
    res.status(200).send(response);
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
console.log("Welcome! open-ir-api :" + port);
module.exports = app;
