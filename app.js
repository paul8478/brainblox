const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const axios = require('axios');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

// Firebase config
const firebaseConfig = require('./firebaseConfig'); // Assuming you have the firebaseConfig.js file

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 20 * 60 * 1000 } // 20 minutes in milliseconds
}));

// Middleware to check if user can access certain pages
function restrictPageAccess(req, res, next) {
    if (req.session.hasVisitedResultPage) {
        if (req.url === '/test1') {
            return res.redirect('/result');
        }
    }
    next();
}

app.use(restrictPageAccess);

// Define routes
const routes = [
    { path: '/', file: 'index.html' },
    { path: '/panel', file: 'dashboard.html' },
    { path: '/rooms', file: 'rooms.html' },
    { path: '/room1', file: 'room1.html' },
    { path: '/room2', file: 'room2.html' },
    { path: '/grank', file: 'grank.html' },
    { path: '/user', file: 'user.html' },
    { path: '/leaderboard', file: 'leaderboard.html' },
    { path: '/test', file: 'test.html' },
    { path: '/register', file: 'register.html' },
    { path: '/login', file: 'login.html' },
    { path: '/profile', file: 'profile.html' },
    { path: '/home', file: 'home.html' },
    { path: '/result', file: 'result.html' },
    { path: '/session-end', file: 'session-end.html' },
    { path: '/session-closed', file: 'session-closed.html' },
    { path: '/not-started', file: 'not-started.html' },
    { path: '/login-register', file: 'login-register.html' },
    { path: '/redirect', file: 'redirect.html' },
    { path: '/end', file: 'end.html' },
];

routes.forEach(route => {
    app.get(route.path, (req, res) => {
        if (route.path === '/result') req.session.hasVisitedResultPage = true;
        res.sendFile(path.join(__dirname, 'views', route.file));
    });
});

// Define static file routes
const staticFiles = [
    { path: '/index.css', file: 'css/index.css' },
    { path: '/style.css', file: 'css/style.css' },
    { path: '/test.css', file: 'css/test.css' },
    { path: '/auth.css', file: 'css/auth.css' },
    { path: '/auth2.css', file: 'css/auth2.css' },
    { path: '/profilecss.css', file: 'css/profilecss.css' },
    { path: '/navbar.css', file: 'css/navbar.css' },
    { path: '/body.css', file: 'css/body.css' },
    { path: '/footer.css', file: 'css/footer.css' },
    { path: '/script.js', file: 'js/script.js' },
    { path: '/homepage.js', file: 'js/homepage.js' },
    { path: '/firebaseauth.js', file: 'js/firebaseauth.js' },
    { path: '/admin1', file: 'admin1.css' },
    { path: '/bg', file: 'images/bg.png' },
    { path: '/main-banner', file: 'images/main-banner.png' },
    { path: '/split-1', file: 'images/split-1.png' },
];

staticFiles.forEach(staticFile => {
    app.get(staticFile.path, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', staticFile.file));
    });
});

// API Routes
app.get('/quizzes', async (req, res) => {
    try {
        const response = await axios.get(`${firebaseConfig.databaseURL}/quize1.json`);
        res.json(response.data);
    } catch (error) {
        console.error('Error retrieving quizzes: ' + error.message);
        res.status(500).send('Error retrieving quizzes');
    }
});

app.post('/start', async (req, res) => {
    console.log('Session start triggered');
    const sessionType = req.body.session_type;
    console.log('Session type:', sessionType);
    let session_code;

    switch (sessionType) {
        case 'session1':
            session_code = 'xyz1';
            break;
        case 'session2':
            session_code = 'abc2';
            break;
        case 'session3':
            session_code = 'room3';
            break;
        case 'session4':
            session_code = 'room4';
            break;
        default:
            console.log('Invalid session type');
            return res.status(400).send('Invalid session type');
    }

    const sessionData = {
        session_code,
        authorized: true,
    };

    try {
        await axios.put(`${firebaseConfig.databaseURL}/globalSession.json`, sessionData);
        console.log('Session data saved successfully');
        res.sendFile(path.join(__dirname, 'views', 'session-started.html'));
    } catch (error) {
        console.error('Error saving session data:', error.message);
        res.status(500).send('Error saving session data');
    }
});

app.post('/logout', async (req, res) => {
    console.log('Session end triggered');
    try {
        await axios.delete(`${firebaseConfig.databaseURL}/globalSession.json`);
        console.log('Session ended successfully');

        // Send a WebSocket message to notify that the session has ended
        wsServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('session-ended');
            }
        });

        res.status(200).send('Session ended'); // Respond with success status
    } catch (error) {
        console.error('Error logging out:', error.message);
        res.status(500).send('Error logging out');
    }
});




// Retrieve session data from Firebase
app.post('/access', async (req, res) => {
    const code = req.body.code;

    try {
        const response = await axios.get(`${firebaseConfig.databaseURL}/globalSession.json`);
        const sessionData = response.data;

        if (sessionData && code === sessionData.session_code) {
            if (sessionData.authorized) {
                let page;
                switch (sessionData.session_code) {
                    case 'xyz1':
                        // Start the Python script here if needed
                        res.sendFile(path.join(__dirname, 'views', 'test1.html'));
                        break;
                    case 'abc2':
                        res.sendFile(path.join(__dirname, 'views', 'test2.html'));
                        break;
                    case 'room3':
                        res.sendFile(path.join(__dirname, 'views', 'test3.html'));
                        break;
                    case 'room4':
                        res.sendFile(path.join(__dirname, 'views', 'test4.html'));
                        break;
                    default:
                        res.redirect('/not-started');
                }
            } else {
                res.redirect('/end');
            }
        } else {
            res.redirect('/not-started');
        }
    } catch (error) {
        console.error('Error accessing session data: ' + error.message);
        res.status(500).send('Error accessing session data');
    }
});

// Save quiz data to Firebase
app.post('/upload', async (req, res) => {
    const { room, question, option1, option2, option3, option4, correctAnswer } = req.body;

    let quizPath;
    if (room === 'room1') {
        quizPath = 'quize1';
    } else if (room === 'room2') {
        quizPath = 'quize2';
    } else {
        return res.status(400).send('Invalid room specified.');
    }

    try {
        const quizRef = `${firebaseConfig.databaseURL}/${quizPath}.json`;
        await axios.post(quizRef, {
            question,
            options: [option1, option2, option3, option4],
            correctAnswer
        });
        res.send('<h1>Quiz uploaded successfully!</h1><br><br><a href="room1"><button>Return Back</button></a>');
    } catch (error) {
        console.error('Error uploading quiz: ' + error.message);
        res.status(500).send('Error uploading quiz');
    }
});

// Submit score to Firebase
app.post('/submit-score', async (req, res) => {
    const { name, phone, score } = req.body;

    if (!name || !phone || score === undefined) {
        console.error('Invalid data provided');
        return res.status(400).json({ success: false, message: 'Invalid data provided' });
    }

    try {
        const scoresRef = `${firebaseConfig.databaseURL}/scores-quiz-1/${name}.json`;
        await axios.put(scoresRef, { name, phone, score });
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving score: ' + error.message);
        res.status(500).json({ success: false, message: 'Error saving score' });
    }
});

const wsServer = new WebSocket.Server({ server });

wsServer.on('connection', (socket) => {
    console.log('A WebSocket client connected.');

    socket.on('message', (message) => {
        console.log('Received from WebSocket client:', message);
    });

    socket.on('close', () => {
        console.log('A WebSocket client disconnected.');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://127.0.0.1:3000');
});
