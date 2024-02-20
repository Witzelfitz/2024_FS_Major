// Import von NPM Packages
// Express ist ein Framework für Node.js, das die Erstellung von Webanwendungen und APIs vereinfacht.
// Mongoose ist ein ODM (Object Data Modeling) für MongoDB und Node.js. Es erleichtert die Arbeit mit MongoDB, indem es die Datenmodellierung und -abfrage erleichtert.
import express from 'express'
import mongoose from 'mongoose'
// Import von selbst erstellten Dateien
// Importiere den Router highscoreRouter aus der Datei routes/highscores.js
// CRUD Operationen für Highscores
import { highscoreRouter } from './routes/highscores.js';


// Erstelle eine neue Express App
const app = express();

// Middleware JSON Parser
app.use(express.json());

// Routes zu den Highscores
// Alle Anfragen, die mit /highscores beginnen, werden an den highscoreRouter weitergeleitet
app.use('/highscores', highscoreRouter);
// app.use('/games', gamesRouter); Mögliche Erweiterung für die Zukunft


// Verbindung zur Datenbank
const db = async () => {
    try {
        await mongoose.connect('mongodb://localhost/2024_fs_major');
        console.log('MongoDB connected');
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
    }
}

db();

// Hello World Screen
app.get('/', (req, res) => {
    res.send(`<h1> Highscores API</h1>
        <p> GET /highscores</p >
    <p>GET /highscores/:id</p>
    <p>POST /highscores</p>
    <p>PUT /highscores/:id</p>
    <p>DELETE /highscores/:id</p>
    `);
});


// Starte den Server auf Port 3000
app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});
