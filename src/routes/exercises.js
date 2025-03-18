const express = require("express");
const exerciseRouter = express.Router();
const { authenticate } = require('../utils');
const { supabase } = require('../db/supabase');

exerciseRouter.use(authenticate);

exerciseRouter.post("/", async (req, res) => {
    try {
        const { name, workout_id, reprange, description } = req.body;

        const { data, error } = await supabase
            .from("workout_exercises")
            .insert([{ workout_id: workout_id, name, reprange, description }])
            .select()
            .single();

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to create new workout-exercise!" });
    }
});

exerciseRouter.get("/:workoutid", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("workout_exercises")
            .select("*")
            .eq("workout_id", req.params.workoutid)

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to fetch workout-exercises!" });
    }
});

exerciseRouter.patch("/:id", async (req, res) => {
    try {
        const { description, reprange } = req.body;

        const updateFields = {};
        if (description) updateFields.description = description;
        if (reprange) updateFields.reprange = reprange;


        const { data, error } = await supabase
            .from("workout_exercises")
            .update(updateFields)
            .select("*")
            .eq("id", req.params.id)

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to update workout-exercises!" });
    }
});


exerciseRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("workout_exercises")
            .delete()
            .eq("id", id);

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, message: "Deleted workout-exercise!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to delete workout-exercise!" });
    }
});


module.exports = { exerciseRouter }