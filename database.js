// Database Kamili - Events + Tickets + Referrals - Bila sqlite3
let events = [
  {id:1, title:"Coastal Music Festival", location:"Nyali Beach, Mombasa", date:"2024-10-12", price:2500, total_slots:500, sold:12, remaining:488, category:"MOMBASA", revenue:30000},
  {id:2, title:"Swahili Food Festival", location:"Mombasa City Hall", date:"2024-10-20", price:1700, total_slots:200, sold:8, remaining:192, category:"MOMBASA", revenue:13600},
  {id:3, title:"Kite Surf Challenge", location:"Malindi Beachfront", date:"2024-10-18", price:2000, total_slots:150, sold:5, remaining:145, category:"MALINDI", revenue:10000},
  {id:4, title:"Malindi Arts Expo", location:"Malindi Museum", date:"2024-10-26", price:2800, total_slots:120, sold:3, remaining:117, category:"MALINDI", revenue:8400}
];
let tickets = [];
let referrals = [];
let nextEventId = 5;
let nextTicketId = 1;

const db = {
  all: (sql, params, cb) => {
    if(sql.includes("FROM events")) cb(null, events);
    else if(sql.includes("FROM tickets")) cb(null, tickets);
    else if(sql.includes("FROM referrals")) cb(null, referrals);
    else cb(null, []);
  },
  get: (sql, params, cb) => {
    if(sql.includes("COUNT") && sql.includes("events")) cb(null, {c: events.length});
    else if(sql.includes("events") && sql.includes("id")) {
      const ev = events.find(e=>e.id==params[0]);
      cb(null, ev);
    } else cb(null, null);
  },
  run: (sql, params, cb) => {
    if(sql.includes("INSERT INTO events")){
      const [title,location,date,price,total_slots,sold,remaining,category,revenue] = params;
      const ne = {id: nextEventId++, title,location,date,price: parseInt(price), total_slots:parseInt(total_slots), sold:0, remaining:parseInt(total_slots), category, revenue:0};
      events.push(ne);
      if(cb) cb.call({lastID: ne.id}, null);
    } else if(sql.includes("DELETE FROM events")){
      events = events.filter(e=>e.id!=params[0]);
      if(cb) cb(null);
    } else if(sql.includes("INSERT INTO tickets")){
      const [ticket_code, event_id, name, phone, price, paid, balance, status, msg] = params;
      tickets.push({id: nextTicketId++, ticket_code, event_id, name, phone, price, paid, balance, status, msg, date: new Date().toISOString()});
      // update event sold
      const ev = events.find(e=>e.id==event_id);
      if(ev){ ev.sold++; ev.remaining--; ev.revenue+=paid; }
      if(cb) cb.call({lastID: nextTicketId}, null);
    } else {
      if(cb) cb(null);
    }
  },
  serialize: (fn) => fn()
};
module.exports = db;
