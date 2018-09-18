'use strict';

const pg = require('pg');
const express = require('express');
require('dotenv').config()

const PORT = process.env.PORT;
const app = express();

const conString = process.env.DATABASE_URL;
const client = new pg.Client(conString);
client.connect();
client.on('error', error => {
  console.error(error);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));


app.set('view engine', 'ejs');

// tasks index: all the tasks
app.get('/', (req, res) => res.redirect('/tasks'));
app.get('/tasks', (request, response) => {
  client.query('SELECT * FROM tasks;')
    .then( (result) => {
      response.render('index', {
        pageTitle: 'Todos BUT UPDATED',
        tasks: result.rows
      });
    })
});
// tasks show: details about one task
app.get('/tasks/:id', (request, response) => {
  let SQL = 'SELECT * FROM tasks WHERE id = $1';
  let values = [ request.params.id ];
  client.query(SQL, values, (err, result) => {
    if (err) {
      console.error(err);
      response.redirect('/error');
    } else {
      response.render('show', {task: result.rows[0] });
    }
  })
});



app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
