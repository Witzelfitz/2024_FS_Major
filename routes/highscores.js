//Import der Blaupausen für die Highscores
import Highscore from '../models/highscore.js';
import express from 'express';
//Erstelle einen neuen Router
const router = express.Router();

//GET /highscores
//Gibt alle Highscores zurück
router.get('/', async (req, res) => {
    try {
        const highscores = await Highscore.find();
        res.json(highscores);
    } catch (error) {
        res.json({message: error});
    }
});

//GET /highscores/:id
//Gibt einen Highscore zurück
router.get('/:id', async (req, res) => {
    try {
        const highscore = await Highscore.findById(req.params.id);
        res.json(highscore);
    } catch (error) {
        res.json({message: error});
    }
});

//DELETE Route für einen spezifischen Highscore
router.delete('/:id', async (req, res) => {
    try {
        const highscore = await Highscore.findByIdAndDelete(req.params.id);
        res.json(highscore);
    } catch (error) {
        res.json({message: error.message});
    }
});

//PUT /highscores/:id
//Aktualisiert einen Highscore
router.put('/:id', async (req, res) => {
    try {
        const highscore = await Highscore.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(highscore);
    } catch (error) {
        res.json({message: error});
    }
}
);

//POST /highscores
//Erstellt einen neuen Highscore
router.post('/', async (req, res) => {
    const highscore = new Highscore({
        name: req.body.name,
        score: req.body.score
    });
    console.log(highscore);

    try {
        const savedHighscore = await highscore.save();
        res.json(savedHighscore);
    } catch (error) {
        res.json({message: error});
    }
});
 
//Exportiere den Router
//Name: highscoreRouter
export { router as highscoreRouter };