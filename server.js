const express = require('express');
const path = require('path');
const cors = require('cors');

// Fungua database yako
require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public folder ndio ina website yako
app.use(express.static(path.join(__dirname, 'public')));

// API ya Events
app.get('/api/events', (req, res) => {
  const db = require('./database');
  db.all("SELECT * FROM events ORDER BY date DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/events', (req, res) => {
  const db = require('./database');
  const { title, description, date, location, category } = req.body;
  db.run(
    `INSERT INTO events (title, description, date, location, category) VALUES (?, ?, ?, ?, ?)`,
    [title, description, date, location, category],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: "Event added!" });
    }
  );
});

// Kila mtu akiingia homepage apelekwe public/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mombasa Events Live on port ${PORT}`);
});