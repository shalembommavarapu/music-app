const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = 5000;
const SECRET_KEY = "santhu123"; // Change this to a strong secret key

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "music.html")));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/musicAppDB", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Error: ", err));

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// 🚀 **User Registration API**
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists!" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🚀 **User Login API**
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Login successful!", token, username: user.username });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🚀 **Serve Home Page**
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "music.html", "home.html"));
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
