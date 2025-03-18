const express = require("express");
const workoutRouter = express.Router();
const { authenticate } = require('../utils');
const { supabase } = require('../db/supabase');

workoutRouter.use(authenticate);

workoutRouter.post("/", async (req, res) => {
    try {
        const { name } = req.body;

        const { data, error } = await supabase
            .from("workouts")
            .insert([{ user_id: req.userId, name}])
            .select()
            .single();

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to create new workout!" });
    }
});

workoutRouter.get("/all", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("workouts")
            .select("*")
            .eq("user_id", req.userId)

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to fetch workout!" });
    }
});

workoutRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("workouts")
            .delete()
            .eq("id", id)
            .eq("user_id", req.userId);

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, message: "Deleted workout!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to delete workout!" });
    }
});

module.exports = { workoutRouter }