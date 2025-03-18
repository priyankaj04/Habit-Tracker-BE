const express = require("express");
const habitlogRouter = express.Router();
const { authenticate } = require('../utils');
const { supabase } = require('../db/supabase');

habitlogRouter.use(authenticate)

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