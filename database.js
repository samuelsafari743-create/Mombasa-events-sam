// Database bila sqlite3 - Inafanya kazi Vercel 100%
let events = [
  {id:1, title:"Coastal Music Festival", location:"Nyali Beach, Mombasa", date:"2024-10-12", price:"2500", total_slots:500, sold:0, remaining:500, category:"MOMBASA", revenue:0},
  {id:2, title:"Swahili Food Festival", location:"Mombasa City Hall", date:"2024-10-20", price:"1700", total_slots:200, sold:0, remaining:200, category:"MOMBASA", revenue:0},
  {id:3, title:"Kite Surf Challenge", location:"Malindi Beachfront", date:"2024-10-18", price:"2000", total_slots:150, sold:0, remaining:150, category:"MALINDI", revenue:0},
  {id:4, title:"Malindi Arts Expo", location:"Malindi Museum", date:"2024-10-26", price:"2800", total_slots:120, sold:0, remaining:120, category:"MALINDI", revenue:0}
];

let tickets = [];
let nextId = 5;

const db = {
  all: (sql, params, cb) => {
    if (sql.includes("events")) cb(null, events);
    else cb(null, tickets);
  },
  get: (sql, params, cb) => {
    cb(null, {c: events.length});
  },
  run: (sql, params, cb) => {
    if (sql.includes("INSERT INTO events")) {
      const [title, location, date, price, total_slots, sold, remaining, category, revenue] = params;
      const newEv = {id: nextId++, title, location, date, price, total_slots, sold, remaining, category, revenue:0};
      events.push(newEv);
      if(cb) cb.call({lastID: newEv.id}, null);
    } else if (sql.includes("DELETE")) {
      const id = params[0];
      events = events.filter(e => e.id != id);
      if(cb) cb(null);
    } else {
      if(cb) cb(null);
    }
  },
  serialize: (fn) => fn()
};

module.exports = db;
