// const express = require('express');
// const path = require('path');
// const http = require('http');
// const fs = require('fs');
// const WebSocket = require('ws');
// const admin = require('firebase-admin');

// const app = express();
// const PORT = process.env.PORT || 3001; // Changed the port number

// // Initialize Firebase Admin SDK
// const serviceAccount = require('./serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://quiz-531fa-default-rtdb.firebaseio.com/', // Replace this with your actual Firebase Realtime Database URL
// });

// // // Serve static files from the "public" directory
// // app.use(express.static(path.join(__dirname, 'public')));

// app.get('/homepage', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'login-register.html'));
// });

// app.get('/next', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'redirect.html'));
// });

// // Create an HTTP server using the Express app
// const server = http.createServer(app);

// // Create a WebSocket server
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//   console.log('New client connected');

//   ws.on('message', (message) => {
//     console.log(`Received: ${message}`);
//     ws.send(`You sent: ${message}`);
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// // Start the server
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
//   console.log('WebSocket server is running');
// });
