require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); //
const uploadRoute = require("./routes/uploadRoute");
const queryRoute = require("./routes/queryRoute");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form submissions
app.use(express.static(path.join(__dirname, "../public"))); // Serve CSS/JS/images

// Routes
app.use("/query", queryRoute);
app.use("/uploads", express.static("uploads")); // Access uploaded files
app.use("/api", uploadRoute);

app.get("/login", (req, res) => {
  res.render("login", { error: null }); // Passing error variable for EJS
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
