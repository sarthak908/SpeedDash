const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.join(__dirname, "../uploads/userdb.db"); // or dynamic from upload

exports.runQueryAndFormat = (req, res) => {
  const userQuery = req.body.query;

  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) return res.status(500).json({ error: "Failed to connect DB" });
  });

  db.all(userQuery, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: "Invalid SQL Query" });
    }

    if (!rows.length) {
      return res
        .status(200)
        .json({ message: "No data returned from query", data: [] });
    }

    const labels = Object.keys(rows[0]);
    const formatted = {
      category: labels[0], // x-axis
      series: labels.slice(1).map((col) => ({
        name: col,
        data: rows.map((row) => row[col]),
      })),
      labels: rows.map((row) => row[labels[0]]),
    };

    db.close();
    res.status(200).json({ chartData: formatted });
  });
};
