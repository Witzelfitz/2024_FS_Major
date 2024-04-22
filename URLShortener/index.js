import express from 'express';
import mongoose from 'mongoose';
import {urlsRouter} from './routes/urls.js';
import cron from 'node-cron';
import {Url} from './models/url.js';
import TelegramBot from 'node-telegram-bot-api';

const app = express();
const PORT = process.env.PORT || 3000;
const chatId = process.env.chatId; 
const telegramToken = process.env.telegramToken; 
const baseUrl = 'http://localhost:3000';

const bot = new TelegramBot(telegramToken, { polling: true });
const message = `Bot Restartet at ${new Date().toLocaleString()}`;

bot.onText(/\/all/, async (msg) => {
    // const chatId = msg.chat.id;

    // Send a GET request to your server to get all URLs
    const response = await fetch(`${baseUrl}/all`);

    if (response.ok) {
        const urls = await response.json();
        //create a delete button for every link
        const message = urls.map(url => {
            const deleteCommand = `/delete/${url.shortUrl}`;
            return `${url.originalUrl} -> ${deleteCommand} -> ${url.validDays}`;
        }).join('\n');
        bot.sendMessage(chatId, message);
    } else {
        bot.sendMessage(chatId, 'Failed to get all URLs. Please try again later.');
    }
}, );

bot.onText(/\/shorten (.+)/, async (msg, match) => {
    //const chatId = msg.chat.id;
    const originalUrl = match[1];  // Extract the URL from the match

    // Send a POST request to your server to create a shortened URL
    const response = await fetch(`${baseUrl}/shorten`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
    });

    if (response.ok) {
    } else {
        bot.sendMessage(chatId, 'Failed to shorten the URL. Please try again later.');
    }
});

bot.onText(/\/delete(.+)/, async (msg, match) => {
    //call the delete endpoint this message is written: /delete/Djnqz 
    const shortUrl = match[1];
    // Send a DELETE request to your server to delete the URL
    const response = await fetch(`${baseUrl}${shortUrl}`, {
        method: 'DELETE',
    });
});


app.use(express.json());


app.set('view engine', 'pug');
app.set('views', './views'); //default
app.use('/css', express.static('public'));

//Connecting to the Database
mongoose.connect('mongodb://localhost/url-shortener')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.get('/', (req, res) => {
    res.render('index');  // Render the Pug template without the shortened URL
});

//Using the router
app.use('/', urlsRouter);


//Cron job to delete the expired urls
cron.schedule('0 0 * * *', async () => {
    //use deleteMany to delete all expired urls (the field in mongoDB is deleteAt)
    await Url.deleteMany({deleteAt: {$lt: new Date()}});

});


//Startin the server and give url to click
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    bot.sendMessage(chatId, message);
});


export {bot, chatId}