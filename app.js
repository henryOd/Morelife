const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const app = express();
const PORT = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true
}));



app.set('view engine', 'ejs');

let players = [];

app.get('/', (req, res) => {
    if (!req.session.players) {
        req.session.players = [];
    }
    res.render('index', { players: req.session.players, teams: null, message: ''});
});

app.post('/addPlayer', (req, res) => {
    const playerName = req.body.playerName;
    if (playerName) {
        req.session.players.push(playerName);
    }
    res.redirect('/');
});

app.post('/removePlayer', (req, res) => {
    const playerIndex = parseInt(req.body.playerIndex);
    if (!isNaN(playerIndex)) {
        req.session.players.splice(playerIndex, 1);
    }
    res.redirect('/');
});


app.post('/formTeams', (req, res) => {

    if (!req.session.players) {
        req.session.players = [];
    }

    if (!req.session.players || req.session.players.length < 8) {
        res.render('index', { players: req.session.players, teams: null, message: 'You need at least 8 players to form teams!' });
        return;
    }

    const playersPerTeam = parseInt(req.body.playersPerTeam) || 4;
    let shuffledPlayers = req.session.players.slice().sort(() => 0.5 - Math.random());
    let teams = [];
    let teamNames = ['Lions', 'Tigers', 'Bears', 'Wolves'];

    while (shuffledPlayers.length) {
        let teamName = teamNames.shift() || `Team ${teams.length + 1}`;
        teams.push({ name: teamName, players: shuffledPlayers.splice(0, playersPerTeam) });
    }

    res.render('index', { players: req.session.players, teams: teams, message: '' });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
