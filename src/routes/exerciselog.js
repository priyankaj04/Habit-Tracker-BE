const express = require("express");
const exerciselogRouter = express.Router();
const { authenticate } = require('../utils');
const { supabase } = require('../db/supabase');

exerciselogRouter.use(authenticate);

exerciselogRouter.post("/", async (req, res) => {
    try {
        const { workout_log_id, exercise_id, weight, completed, reprange, description } = req.body;

        const { data, error } = await supabase
            .from("workout_exercise_logs")
            .insert([{ workout_log_id, exercise_id, weight, completed, reprange, description }])
            .select()
            .single();

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to create new workout-exercise-log!" });
    }
});

exerciselogRouter.get("/:workoutlogid", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("workout_exercise_logs")
            .select("*")
            .eq("workout_log_id", req.params.workoutlogid)

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to fetch workout-exercises-log!" });
    }
});

exerciselogRouter.get("/exercise/:exerciseid", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("workout_exercise_logs")
            .select("*")
            .eq("exercise_id", req.params.exerciseid)

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to fetch workout-exercises-log!" });
    }
});

exerciselogRouter.patch("/:id", async (req, res) => {
    try {
        const { weight, completed, reprange, description } = req.body;

        const updateFields = {};
        if (weight) updateFields.weight = weight;
        if (typeof completed == 'boolean') updateFields.completed = completed;
        if (description) updateFields.description = description;
        if (reprange) updateFields.reprange = reprange;


        const { data, error } = await supabase
            .from("workout_exercise_logs")
            .update(updateFields)
            .select("*")
            .eq("id", req.params.id)

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to update workout-exercises-log!" });
    }
});


exerciselogRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("workout_exercise_logs")
            .delete()
            .eq("id", id);

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, message: "Deleted workout-exercise!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to delete workout-exercise!" });
    }
});


module.exports = { exerciselogRouter }