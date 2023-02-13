require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require("express");

const parser = require("./parser.js");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.listen(process.env.PORT);
app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body);
    const token = process.env.TELEGRAM_TOKEN;
    let bot;
    bot = new TelegramBot(token);
    bot.setWebHook(process.env.VERCEL_APP + bot.token);

    bot.onText(/\/word (.+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const word = match[1];
        axios
        .get(`${process.env.OXFORD_API_URL}/entries/en-gb/${word}`, {
            params: {
            fields: 'definitions',
            strictMatch: 'false'
            },
            headers: {
            app_id: process.env.OXFORD_APP_ID,
            app_key: process.env.OXFORD_APP_KEY
            }
        })
        .then(response => {
            const parsedHtml = parser(response.data);
            bot.sendMessage(chatId, parsedHtml, { parse_mode: 'HTML' });
        })
        .catch(error => {
            const errorText = error.response.status === 404 ? `No definition found for the word: <b>${word}</b>` : `<b>An error occured, please try again later</b>`;
            bot.sendMessage(chatId, errorText, { parse_mode:'HTML'})
        });
    });
  res.sendStatus(200);
});



