const express = require("express");
const habitRouter = express.Router();
const jwt = require("jsonwebtoken");
const { supabase } = require('../db/supabase');

const authenticate = async (req, res, next) => {
    const token = req.header("Authorization") && req.header("Authorization").replace(/^Bearer\s+/, "");;
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ status: 0, error: "Invalid token." });
    }
};

// Add a new habit
habitRouter.post("/", authenticate, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ status: 0, error: "Habit name is required" });

        const { data, error } = await supabase
            .from("habits")
            .insert([{ user_id: req.userId, name }])
            .select();

        if (error) return res.status(400).json({ status: 0, error: error.message });

        res.json({ status: 1, data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to create new habit!" });
    }
});


// Fetch all habits for the logged-in user
habitRouter.get("/all", authenticate, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("habits")
            .select("*")
            .eq("user_id", req.userId);

        if (error) return res.status(400).json({ status: 0, error: error.message });
        res.json({ status: 1, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to create new habit!" });
    }
});

// Delete a habit
habitRouter.delete("/:id", authenticate, async (req, res) => {
    try {
        const habitId = req.params.id;

        const { data, error } = await supabase
            .from("habits")
            .delete()
            .match({ id: habitId, user_id: req.userId });

        if (error) return res.status(400).json({ status: 0, error: error.message });
        res.json({ status: 1, message: "Habit deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to create new habit!" });
    }
});


module.exports = { habitRouter }