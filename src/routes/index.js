
const express = require('express');
const apiRouter = express.Router();

const { userRouter } = require('./users');
const { authRouter } = require('./auth');
const  { habitRouter } = require('./habits');

apiRouter.use('/auth', authRouter);
apiRouter.use('/habit', habitRouter);

module.exports = { apiRouter }