const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

// 1. GET EVENTS
app.get('/api/events', (req,res)=>{
  db.all("SELECT * FROM events", [], (err, rows)=> res.json(rows));
});

// 2. ADD EVENT
app.post('/api/events', (req,res)=>{
  const {title, location, date, price, total_slots, category} = req.body;
  db.run("INSERT INTO events (title,location,date,price,total_slots,sold,remaining,category,revenue) VALUES (?,?,?,?,?,?,?,?,?)",
    [title, location, date, price, total_slots, 0, total_slots, category, 0],
    function(){ res.json({ok:1, id: this.lastID}); });
});

// 3. DELETE EVENT
app.delete('/api/events/delete/:id', (req,res)=>{
  db.run("DELETE FROM events WHERE id=?", [req.params.id], ()=> res.json({ok:1}));
});

// 4. BUY TICKET / ADD MTU - HII NDIO MUHIMU
app.post('/api/tickets/buy', (req,res)=>{
  const {event_id, name, phone, paid} = req.body;
  db.get("SELECT * FROM events WHERE id=?", [event_id], (err, event)=>{
    if(!event) return res.status(404).json({error: "Event not found"});
    const ticket_code = "MBSA-" + Math.random().toString(36).substr(2,8).toUpperCase();
    const price = event.price;
    const paidAmount = parseInt(paid) || price;
    const balance = price - paidAmount;
    let status = "paid", msg = "Full payment received. Ticket confirmed. No balance.";
    if(balance > 0 && balance < price){ status="half"; msg=`Partial payment. Balance KES ${balance} pending.`; }
    else if(balance >= price){ status="pending"; msg="Payment pending. Please pay to receive ticket."; }
    
    db.run("INSERT INTO tickets (ticket_code, event_id, name, phone, price, paid, balance, status, msg) VALUES (?,?,?,?,?,?,?,?,?)",
      [ticket_code, event_id, name, phone, price, paidAmount, balance, status, msg],
      function(){ 
        res.json({ok:1, ticket_code, status, msg, balance, event: event.title});
      });
  });
});

// 5. GET ALL TICKETS
app.get('/api/tickets', (req,res)=>{
  db.all("SELECT * FROM tickets", [], (err, rows)=> res.json(rows));
});

// 6. VERIFY TICKET
app.get('/api/tickets/verify/:code', (req,res)=>{
  db.all("SELECT * FROM tickets", [], (err, rows)=>{
    const t = rows.find(x=>x.ticket_code===req.params.code);
    if(!t) return res.json({valid:false});
    res.json({valid:true, ticket: t});
  });
});

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
