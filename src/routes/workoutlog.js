const express = require("express");
const workoutlogRouter = express.Router();
const { authenticate } = require('../utils');
const { supabase } = require('../db/supabase');

workoutlogRouter.use(authenticate);

workoutlogRouter.post("/", async (req, res) => {
    try {
        const { workout_id, date, mood, session_rating, description } = req.body;

        const { data, error } = await supabase
            .from("workout_logs")
            .insert([{ user_id: req.userId, workout_id, date, mood, session_rating, description }])
            .select()
            .single();

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to create new workout-log!" });
    }
});

workoutlogRouter.get("/all", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("workout_logs")
            .select("*, workouts(name)")
            .eq("user_id", req.userId)

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to fetch workout-log!" });
    }
});

workoutlogRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("workout_logs")
            .delete()
            .eq("id", id)
            .eq("user_id", req.userId);

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, message: "Deleted workout-log!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to delete workout-log!" });
    }
});

workoutlogRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { mood, session_rating, description } = req.body;

        const updateFields = {};
        if (mood) updateFields.mood = mood;
        if (session_rating) updateFields.session_rating = session_rating;
        if (description) updateFields.description = description;
        
        const { data, error } = await supabase
            .from("workout_logs")
            .update(updateFields)
            .eq("id", id)
            .eq("user_id", req.userId);

        if (error) return res.status(500).json({ status: 0, error: error.message });

        res.json({ status: 1, message: "Updated workout-log successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to update workout-log!" });
    }
});

module.exports = { workoutlogRouter }