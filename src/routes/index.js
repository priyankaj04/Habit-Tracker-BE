
const express = require('express');
const apiRouter = express.Router();

const { authRouter } = require('./auth');
const  { habitRouter } = require('./habits');
const  { habitlogRouter } = require('./habitlog');
const  { journalRouter } = require('./journal');
const  { todoRouter } = require('./todo');

apiRouter.use('/auth', authRouter);
apiRouter.use('/habit', habitRouter);
apiRouter.use('/habitlog', habitlogRouter);
apiRouter.use('/journal', journalRouter);
apiRouter.use('/todo', todoRouter);

module.exports = { apiRouter }