const express = require('express');
const path = require('path');
const cors = require('cors');

require('./database');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API ya Events - Get
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

// API ya Events - Add
app.post('/api/events', (req, res) => {
  const db = require('./database');
  const { title, location, date, price, total_slots, category } = req.body;
  db.run(
    "INSERT INTO events (title, location, date, price, total_slots, sold, remaining, category, revenue) VALUES (?,?,?,?,?,?,?, ?, 0)",
    [title, location, date, price, total_slots, 0, total_slots, category],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: 1, id: this.lastID });
    }
  );
});

app.delete('/api/events/delete/:id', (req, res) => {
  const db = require('./database');
  db.run("DELETE FROM events WHERE id=?", [req.params.id], () => {
    res.json({ ok: 1 });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// KWA VERCEL - HII NDIO MUHIMU
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Running on ${PORT}`));
}
module.exports = app;
