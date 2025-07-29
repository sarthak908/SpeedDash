const express = require("express");
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // to parse JSON requests

// Sample route
app.get("/", (req, res) => {
  res.send("SpeedDash API is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
