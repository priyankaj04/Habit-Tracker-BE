const express = require("express");
const journalRouter = express.Router();
const { authenticate } = require('../utils');
const { supabase } = require('../db/supabase');

journalRouter.use(authenticate);

journalRouter.post("/", authenticate, async (req, res) => {
    try {
        const { entry } = req.body;
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD

        const { data, error } = await supabase
            .from("journals")
            .insert([{ user_id: req.userId, entry, date: today }])
            .select()
            .single();

        if (error) return res.status(500).json({ status: 0, error: error.message });

        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to create new journal!" });
    }
});

journalRouter.get("/all", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("journals")
            .select("*")
            .eq("user_id", req.userId)
            .order("date", { ascending: false });

        if (error) return res.status(500).json({ status: 0, error: error.message });

        res.json({ status: 1, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to fetch journals!" });
    }
});

journalRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("journals")
            .delete()
            .eq("id", id)
            .eq("user_id", req.userId);;

        if (error) return res.status(500).json({ status: 0, error: error.message });

        res.json({ status: 1, message: "Deleted journal successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to delete journal!" });
    }
});

journalRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { entry } = req.body;

        const { data, error } = await supabase
            .from("journals")
            .update({"entry": entry})
            .eq("id", id)
            .eq("user_id", req.userId);

        if (error) return res.status(500).json({ status: 0, error: error.message });

        res.json({ status: 1, message: "Updated journal successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to delete journal!" });
    }
});


module.exports = { journalRouter }