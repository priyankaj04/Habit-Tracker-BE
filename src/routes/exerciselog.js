const express = require("express");
const exerciselogRouter = express.Router();
const { authenticate } = require('../utils');
const { supabase } = require('../db/supabase');

exerciselogRouter.use(authenticate);

module.exports = { exerciselogRouter }