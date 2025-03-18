const express = require("express");
const workoutlogRouter = express.Router();
const { authenticate } = require('../utils');
const { supabase } = require('../db/supabase');

workoutlogRouter.use(authenticate);

module.exports = { workoutlogRouter }