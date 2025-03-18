
const express = require('express');
const apiRouter = express.Router();

const { authRouter } = require('./auth');
const  { habitRouter } = require('./habits');
const  { habitlogRouter } = require('./habitlog');
const  { journalRouter } = require('./journal');
const  { todoRouter } = require('./todo');
const  { workoutRouter } = require('./workout');
const  { workoutlogRouter } = require('./workoutlog');
const  { exerciseRouter } = require('./exercises');
const  { exerciselogRouter } = require('./exerciselog');

apiRouter.use('/auth', authRouter);
apiRouter.use('/habit', habitRouter);
apiRouter.use('/habitlog', habitlogRouter);
apiRouter.use('/journal', journalRouter);
apiRouter.use('/todo', todoRouter);
apiRouter.use('/workout', workoutRouter);
apiRouter.use('/workoutlog', workoutlogRouter);
apiRouter.use('/exercise', exerciseRouter);
apiRouter.use('/exerciselog', exerciselogRouter);

module.exports = { apiRouter }