const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'petslog'
});
const app = express();
const urlencode = bodyParser.urlencoded({ extended: false });

function startconnect() {
  connection.connect(error => {
    if (error) {
      console.log('Connection to database failed');
      return;
    } else {
      console.log('Connected!');
    }
  });
}

function endconnect() {
  connection.end(err => {
    if (err) {
      console.log('Database connection not ended!');
      console.log(err);
    }
  });
}

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  //Verwijder caching om de laatste data te ontvangen
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

/*------------------
Homepage
--------------------*/

app.get('/', (req, res) => {
  res.send('This is the response from the homepage on your GET request');
  console.log('get request received from home');
});

app.post('/', urlencode, (req, res) => {
  startconnect();
  connection.query(
    "select pet.id,pet.name, pet.species, pet.sex, CASE WHEN pet.death IS NULL THEN timestampdiff(YEAR, pet.birth, now()) ELSE 'X' END AS age, event.remark, DATE_FORMAT(event.date,'%d-%m-%y') AS datum from pet join event on pet.id = event.reftopet",
    (err, rows) => {
      if (err) {
        console.log('No data found');
      }
      console.log('Data received from database');
      //console.log(rows);
      console.log('Data served coming from POST request');
      let rows_tostring = JSON.stringify(rows);
      res.send(rows_tostring);
    }
  );

  app.delete('/:id', (req, res) => {
    console.log(req.params);
    connection.query(
      'delete from event where reftopet = ' + req.params.id,
      (err, rows) => {
        if (err) {
          console.log('No data found');
          console.log(err);
        } else {
          connection.query(
            'delete from pet where id = ' + req.params.id,
            (err, rows) => {
              if (err) {
                console.log('No data found');
              }
              console.log('Data received from database');
              //console.log(rows);
              console.log('Data served coming from POST request');
              let rows_tostring = JSON.stringify(rows);
              res.send('ok');
            }
          );
        }
      }
    );
  });
});

/*------------------
listen to port
--------------------*/

app.listen('3000', () => {
  console.log('Express listening on port 3000');
});
