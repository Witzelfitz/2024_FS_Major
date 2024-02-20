//Import Mongoose
import mongoose from 'mongoose'

//Erstelle ein Schema für die Highscores
// Ein Schema ist eine Art Blaupause für die Datenbank. Es definiert die Struktur der Dokumente, die in einer bestimmten Sammlung gespeichert werden.
const highscoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//Erstelle ein Model für die Highscores
// Ein Model ist eine Klasse, die auf einem Schema basiert und Methoden zum Erstellen und Abfragen von Dokumenten in einer bestimmten Sammlung bereitstellt.
const Highscore = mongoose.model('Highscore', highscoreSchema);

export default Highscore;
