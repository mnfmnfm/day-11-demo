'use strict';

const pg = require('pg');
const express = require('express');
const ejs = require('ejs');
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

app.get('/', (request, response) => {
  client.query('SELECT * FROM tasks;')
    .then( (result) => {
      response.render('index', {
        pageTitle: 'Todos BUT FROM THE SERVER JS FILE',
        tasks: result.rows
      });
    })
});


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
