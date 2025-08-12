const fs = require("fs");

function parseSQLFile(filePath) {
  const sql = fs.readFileSync(filePath, "utf8");

  const tableRegex = /CREATE TABLE (\w+)\s*\(([^;]+)\);/gi;
  const columnRegex = /^\s*([\w_]+)\s+([\w()]+)(?:\s+[^,]*)?,?$/gm;
  const insertRegex = /INSERT INTO (\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\);/gi;
  const selectRegex = /SELECT\s+.+?FROM\s+(\w+);/gi;

  let tables = [];

  // Parse CREATE TABLE
  let match;
  while ((match = tableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const columnsBlock = match[2];

    let columns = [];
    let columnMatch;
    while ((columnMatch = columnRegex.exec(columnsBlock)) !== null) {
      const colName = columnMatch[1];
      const colType = columnMatch[2];
      columns.push({ name: colName, type: colType });
    }

    tables.push({
      name: tableName,
      columns,
      rows: [],
      queries: []
    });
  }

  // Parse INSERT INTO
  while ((match = insertRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const cols = match[2].split(",").map(c => c.trim());
    const values = match[3].split(",").map(v => v.trim().replace(/^'(.*)'$/, "$1"));

    const table = tables.find(t => t.name === tableName);
    if (table) {
      const row = {};
      cols.forEach((col, i) => {
        row[col] = isNaN(values[i]) ? values[i] : Number(values[i]);
      });
      table.rows.push(row);
    }
  }

  // Parse SELECT queries
  while ((match = selectRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const table = tables.find(t => t.name === tableName);
    if (table) {
      table.queries.push(match[0]);
    }
  }

  return { tables };
}

module.exports = { parseSQLFile };
