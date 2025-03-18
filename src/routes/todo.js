const express = require("express");
const todoRouter = express.Router();
const { authenticate } = require('../utils');
const { supabase } = require('../db/supabase');

todoRouter.use(authenticate);

todoRouter.post("/", async (req, res) => {
    try {
        const { task, date } = req.body;
        const taskDate = date || new Date().toISOString().split("T")[0]; // Default to today

        const { data, error } = await supabase
            .from("todos")
            .insert([{ user_id: req.userId, task, date: taskDate, completed: false}])
            .select()
            .single();

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to create new task!" });
    }
});

todoRouter.get("/", async (req, res) => {
    try {
        const { from, to } = req.query;
        const today = new Date().toISOString().split("T")[0];
        const startDate = from || today;
        const endDate = to || today;

        const { data, error } = await supabase
            .from("todos")
            .select("*")
            .eq("user_id", req.userId)
            .gte("date", startDate)
            .lte("date", endDate)
            .order("date", { ascending: true });

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to fetch tasks!" });
    }
});

todoRouter.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { completed, date } = req.body;

        const updateFields = {};
        if (typeof completed === 'boolean') updateFields.completed = completed;
        if (date) updateFields.date = date;

        const { data, error } = await supabase
            .from("todos")
            .update(updateFields)
            .eq("id", id)
            .eq("user_id", req.userId)
            .select()
            .single();

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to update task!" });
    }
});

todoRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("todos")
            .delete()
            .eq("id", id)
            .eq("user_id", req.userId);

        if (error) return res.status(500).json({ status: 0, error: error.message });
        res.json({ status: 1, message: "Deleted task!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to delete task!" });
    }
});

module.exports = { todoRouter }