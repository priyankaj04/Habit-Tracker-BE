
const express = require('express');
const apiRouter = express.Router();

const { userRouter } = require('./users');
const { authRouter } = require('./auth');

apiRouter.use('/auth', authRouter);

module.exports = { apiRouter }