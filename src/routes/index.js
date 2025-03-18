
const express = require('express');
const apiRouter = express.Router();

const { authRouter } = require('./auth');
const  { habitRouter } = require('./habits');
const  { habitlogRouter } = require('./habitlog');
const  { journalRouter } = require('./journal');

apiRouter.use('/auth', authRouter);
apiRouter.use('/habit', habitRouter);
apiRouter.use('/habitlog', habitlogRouter);
apiRouter.use('/journal', journalRouter);


module.exports = { apiRouter }