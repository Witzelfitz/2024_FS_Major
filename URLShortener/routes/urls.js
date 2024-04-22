import express from 'express';
import { Url, validateUrl } from '../models/url.js';
import { bot, chatId } from '../index.js';

const router = express.Router();
router.use(express.json());


router.get('/all' , async (req, res) => {
    const urls = await Url.find();
    res.send(urls);
}
);


router.delete('/:shortUrl', async (req, res) => {
    try {
        const result = await Url.deleteOne({ shortUrl: req.params.shortUrl });
        if (result.deletedCount === 0) {
            return res.status(404).send('The URL with the given shortUrl was not found.');
        }
        res.send({ message: 'URL successfully deleted' });
    } catch (error) {
        res.status(500).send('Error deleting the URL: ' + error.message);
    }
});


router.post('/shorten', async (req, res) => {
    const { error } = validateUrl(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const url = new Url({
        originalUrl: req.body.originalUrl,
    });

    await url.save();

    bot.sendMessage(chatId, `New URL shortened: ${url.shortUrl}`);
    res.send(url);
});



export {router as urlsRouter};
