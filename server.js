const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/events', (req,res)=>{
  db.all("SELECT * FROM events", [], (err, rows)=>{
    res.json(rows);
  });
});

app.post('/api/events', (req,res)=>{
  const {title, location, date, price, total_slots, category} = req.body;
  db.run("INSERT INTO events (title,location,date,price,total_slots,sold,remaining,category,revenue) VALUES (?,?,?,?,?,?,?,?,?)",
    [title, location, date, price, total_slots, 0, total_slots, category, 0],
    function(err){
      res.json({ok:1, id: this.lastID});
    });
});

app.delete('/api/events/delete/:id', (req,res)=>{
  db.run("DELETE FROM events WHERE id=?", [req.params.id], ()=> res.json({ok:1}));
});

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
