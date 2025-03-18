const express = require("express");
const exerciseRouter = express.Router();
const { authenticate } = require('../utils');
const { supabase } = require('../db/supabase');

exerciseRouter.use(authenticate);

module.exports = { exerciseRouter }