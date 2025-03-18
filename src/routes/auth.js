const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { supabase } = require('../db/supabase');

// TODO: Add validations

// User Registration
authRouter.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in Supabase
        const { data, error } = await supabase
            .from("users")
            .insert([{ email, password: hashedPassword }]);

        if (error) return res.status(400).json({ status: 0, error: error.message });

        res.json({ status: 1, message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to register!" });
    }
});

// User Login
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch user from DB
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !data) return res.status(400).json({ error: "Invalid email or password" });

        // Compare password
        const validPassword = await bcrypt.compare(password, data.password);
        if (!validPassword) return res.status(400).json({ error: "Invalid email or password" });

        // Generate JWT Token
        const token = jwt.sign({ userId: data.id }, process.env.JWT_SECRET, { expiresIn: "100y" });

        res.json({ status: 1, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: "Failed to login!" });
    }
});

module.exports = { authRouter }