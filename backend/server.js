require("dotenv").config();
const express = require("express");
const cors = require("cors"); // ✅ 1. ADD THIS LINE
const path = require("path");

// --- Import Routes ---
const uploadRoute = require("./routes/uploadRoute");
const queryRoute = require("./routes/queryRoute");
const geminiRoute = require("./routes/geminiRoute");

const app = express();

// --- View engine setup ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// --- Middleware ---
// IMPORTANT: Middleware must come BEFORE routes that use it.
app.use(cors({ origin: 'http://127.0.0.1:5500' })); // Apply CORS to all routes
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for forms

// --- Static File Serving ---
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use("/visualisations", express.static(path.join(__dirname, "../visualisations")));
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "../public")));


// --- API and Page Routes ---
app.use("/query", queryRoute);
app.use("/api", uploadRoute);
app.use("/api/openai", geminiRoute);
app.get("/loginpublic", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

app.get("/loginejs", (req, res) => {
    res.render("login", { error: null });
});


// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));