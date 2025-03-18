const express = require("express");
const habitlogRouter = express.Router();
const jwt = require("jsonwebtoken");
const { supabase } = require('../db/supabase');

const authenticate = async (req, res, next) => {
    const token = req.header("Authorization") && req.header("Authorization").replace(/^Bearer\s+/, "");;
    if (!token) return res.status(401).json({ status: 0, error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ status: 0, error: "Invalid token." });
    }
};


habitlogRouter.post("/", async (req, res) => {
    try {
        const { habit_id } = req.body;
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD

        // Check if a log already exists for today
        const { data: existingLog, error: fetchError } = await supabase
            .from("habit_logs")
            .select("*")
            .eq("habit_id", habit_id)
            .eq("date", today)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") { // Ignore "row not found" error
            return res.status(500).json({ error: fetchError.message });
        }

        // If log exists, return it
        if (existingLog) {
            return res.json({ status: 1, data: existingLog });
        }

        // Otherwise, create a new "pending" log
        const { data, error } = await supabase
            .from("habit_logs")
            .insert([{ habit_id, date: today, status: false }])
            .select()
            .single();

        if (error) return res.status(500).json({ status: 0, error: error.message });

        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to create new habit-log!" });
    }
});

habitlogRouter.patch("/:log_id", async (req, res) => {
    try {
        const { log_id } = req.params;

        const { data, error } = await supabase
            .from("habit_logs")
            .update({ status: true })
            .eq("id", log_id)
            .select()
            .single();

        if (error) return res.status(500).json({ status: 0, error: error.message });

        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to update habit-log!" });
    }
});


habitlogRouter.get("/:habit_id", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("habit_logs")
            .select("*, habits(name)") // Fetch habits alongside logs
            .eq("habit_id", req.params.habit_id);

        if (error) return res.status(500).json({ status: 0, error: error.message });

        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to fetch habit-logs!" });
    }
});


module.exports = { habitlogRouter }