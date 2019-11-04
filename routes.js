const mysql = require('mysql');
const bodyparser = require('body-parser');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'cis435',
  password: 'project3',
  database: 'cis435_schema'
});

connection.connect((err)=>{
(err) ? console.log(err) : console.log(connection);
})

module.exports = function(app) {

  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get('/getTimeSlots', (req, res) =>{
    connection.query('SELECT * FROM time_slots', (err, data)=>{
      if(err)
        console.log(err);

      console.log(data);
      res.send(data);
    })
  })

  app.post('/bookReservation', async (req, res) => {
    let data = await selectAllByUmid(req.body.umid)    
    let timeframe = await selectAllByTimeFrame(req.body.scheduled);
    console.log('TimeFrame: ' + timeframe);

    if(data.length < 1 || data == undefined){
      let isSuccess = await insertAllIntoStudents(req.body);
      if(isSuccess){
        res.status(200);
        res.send('success');
      } else{
        console.log(err);
        res.status(500);
        res.send('error');
      }
    } else {
      res.status(302);
      res.send(result);
    }
  })

  app.post('/getReservation', (req, res) => {
    connection.query('SELECT * FROM students WHERE umid='+req.body.umid, (err, data)=>{
      if(err)
        console.log(err);

      res.send(data);
    })
  })
};

function selectAllByTimeFrame(timeframe){
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM time_slots WHERE timeframe='" + timeframe + "'", (err, data) => {
      resolve(data);
    });
  })  
}

function selectAllByUmid(umid){
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM students WHERE umid='+umid, async (err, data)=>{
      resolve(data);
    });
  });
}

function insertAllIntoStudents(request){
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO students VALUES (" + request.umid + ", '" + request.first + "', '" + request.last + "', '"
      + request.title + "', '" + request.email + "', '" + request.phone + "', '" + request.scheduled
      + "');", (err)=>{
      
      if(err) reject(false);
      resolve(true);
    })
  })
}