require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { resolve } = require("path");
const bcrypt = require("bcrypt");
const User = require("./models/User"); // Import the User model

const app = express();
const port = 3010;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.static("static"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(resolve(__dirname, "pages/index.html"));
});

// Signup Route
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
