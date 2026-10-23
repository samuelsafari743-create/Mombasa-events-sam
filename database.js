const sqlite3=require('sqlite3').verbose();
const db=new sqlite3.Database('./eventhub.db');
const names=["John Otieno","Aisha Mohamed","Brian Kimani","Fatma Ali","Kevin Omondi","Grace Wanjiku","Samuel Safari","Linda Chebet","David Mwangi","Mercy Akinyi","James Karanja","Zainab Hassan","Peter Njoroge","Amina Juma","Michael Oduor","Lucy Atieno","Abdulrahman Said","Rose Nyaboke","Daniel Kiplagat","Halima Yusuf","Joseph Mwachala","Neema Mwakio","Victor Ochieng","Sharon Wafula","Ali Bakari","Esther Muthoni","Collins Kipchoge","Joyce Mwikali","Hassan Abdalla","Betty Jepkosgei","Emmanuel Kazungu","Ruth Mumbi","Catherine Wanja","Omar Mzee","Diana Mwachofi","Patrick Mutua","Salma Omar","George Fondo","Faith Kadzo","Isaac Katana","Mariam Mwatela","Stephen Karisa","Winnie Wakesho","Yusuf Mbwana","Ann Mwangome","Charles Mwarandu","Rehema Mshamba","Edward Kitsao","Naomi Nyale","Benard Ngala","Khadija Charo","Thomas Dena","Jackline Mwagandi","Hamisi Mwagandi","Christine Mwangemi"];
db.serialize(()=>{
  db.run("DROP TABLE IF EXISTS events");
  db.run("DROP TABLE IF EXISTS tickets");
  db.run("DROP TABLE IF EXISTS referrals");
  db.run("CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, location TEXT, date TEXT, price INTEGER, total_slots INTEGER, sold INTEGER DEFAULT 0, remaining INTEGER, category TEXT, revenue INTEGER)");
  db.run("CREATE TABLE tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_code TEXT UNIQUE, event_id INTEGER, customer_name TEXT, phone TEXT, source TEXT, referral TEXT, amount_paid INTEGER, balance INTEGER, payment_status TEXT, payment_message TEXT, paid_at TEXT, qr TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
  db.run("CREATE TABLE referrals (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE, platform TEXT, clicks INTEGER DEFAULT 0, sales INTEGER DEFAULT 0)");
  const evs=[
    ["Coastal Music Festival","Nyali Beach, Mombasa","2024-10-12",2500,500,0,500,"MOMBASA",0],
    ["Swahili Food Festival","Mombasa City Hall","2024-10-20",1700,200,0,200,"MOMBASA",0],
    ["Kite Surf Challenge","Malindi Beachfront","2024-10-18",2000,150,0,150,"MALINDI",0],
    ["Malindi Arts Expo","Malindi Museum","2024-10-26",2800,120,0,120,"MALINDI",0]
  ];
  let inserted=0;
  evs.forEach(ev=>{
    db.run("INSERT INTO events (title,location,date,price,total_slots,sold,remaining,category,revenue) VALUES (?,?,?,?,?,?,?,?,?)",ev,function(){
      inserted++;
      if(inserted===evs.length){
        for(let i=0;i<56;i++){
          const name=names[i%names.length];
          const phone="07"+(10000000+Math.floor(Math.random()*90000000));
          const eventId=Math.floor(Math.random()*4)+1;
          const price=[2500,1700,2000,2800][eventId-1];
          let status,paid,bal,msg;
          let r=Math.random();
          if(r<0.6){status="paid";paid=price;bal=0;msg="Full payment received. Ticket confirmed. No refund after payment."}
          else if(r<0.8){status="half";paid=Math.floor(price/2);bal=price-paid;msg="Partial payment: "+paid+" KES paid. Balance "+bal+" KES must be paid to enter."}
          else if(r<0.9){status="pending";paid=0;bal=price;msg="Payment pending. Please pay to receive valid ticket. Scanning will show PAY."}
          else{status="cash";paid=price;bal=0;msg="John paid cash. Balance is cash to pay before event - cleared."}
          const code="ME-TC-"+(10000+i);
          const paidAt=new Date().toISOString();
          const source=["whatsapp","tiktok","facebook","instagram","mpesa","direct"][Math.floor(Math.random()*6)];
          const referral=["whatsapp","tiktok","facebook","instagram","direct"][Math.floor(Math.random()*5)];
          db.run("INSERT INTO tickets (ticket_code,event_id,customer_name,phone,source,referral,amount_paid,balance,payment_status,payment_message,paid_at,qr) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",[code,eventId,name,phone,source,referral,paid,bal,status,msg,paidAt,""],()=>{
            db.run("UPDATE events SET sold=sold+1, remaining=total_slots-sold, revenue=revenue+? WHERE id=?",[paid,eventId]);
          });
        }
        console.log("DB SEEDED 56 CUSTOMERS");
      }
    });
  });
  ["whatsapp","tiktok","facebook","instagram","direct"].forEach(p=>{
    db.run("INSERT INTO referrals (code,platform,clicks,sales) VALUES (?,?,?,?)",[p,p,Math.floor(Math.random()*200)+50,Math.floor(Math.random()*30)+10]);
  });
});
module.exports=db;