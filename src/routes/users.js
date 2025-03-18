const express = require("express");
const userRouter = express.Router();
const { createClient } = require("@supabase/supabase-js");


module.exports = { userRouter }