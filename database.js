const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Vercel inaruhusu kuandika /tmp pekee
const dbPath = path.join('/tmp', 'eventhub.db');
const db = new sqlite3.Database(dbPath);

const names=["John Otieno","Aisha Mohamed","Brian Kimani","Fatma Ali","Kevin Omondi","Grace Wanjiku"];

db.serialize(()=>{
  db.run("CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, location TEXT, date TEXT, price TEXT, total_slots INTEGER, sold INTEGER, remaining INTEGER, category TEXT, revenue INTEGER)");
  db.run("CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_code TEXT UNIQUE, event_id INTEGER, name TEXT, phone TEXT, price INTEGER, paid INTEGER, balance INTEGER, status TEXT, msg TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS referrals (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE, platform TEXT, count INTEGER)");

  db.get("SELECT COUNT(*) as c FROM events", (err, row)=>{
    if(row && row.c === 0){
      const evs=[
        ["Coastal Music Festival","Nyali Beach, Mombasa","2024-10-12","2500",500,0,500,"MOMBASA",0],
        ["Swahili Food Festival","Mombasa City Hall","2024-10-20","1700",200,0,200,"MOMBASA",0],
        ["Kite Surf Challenge","Malindi Beachfront","2024-10-18","2000",150,0,150,"MALINDI",0],
        ["Malindi Arts Expo","Malindi Museum","2024-10-26","2800",120,0,120,"MALINDI",0]
      ];
      evs.forEach(ev=>{
        db.run("INSERT INTO events (title,location,date,price,total_slots,sold,remaining,category,revenue) VALUES (?,?,?,?,?,?,?,?,?)", ev);
      });
    }
  });
});

module.exports = db;
