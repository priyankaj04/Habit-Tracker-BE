const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors');
const crypto = require('node:crypto')
require('dotenv').config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const app = express();

app.use(cors());
app.options('*', cors())

app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by')

app.disable('RateLimit-Policy')

app.set('trust proxy', 1);

app.get('/', async (req, res) => {
    res.status(200).json('habit-tracker:server' + new Date());
});

app.use((req, res, next) => {
    res.status(404).send('404: Page not found');
});

const server = app.listen(PORT, HOST, () => {
    console.log(`Running on https://${HOST}:${PORT}`);
});

function shutdown() 
{
    console.log('Shutting down server...');
    server.close(async () => {
      console.log('Express server closed.');
    });

    // If server hasn't finished in 10 seconds, shut down forcefully
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);