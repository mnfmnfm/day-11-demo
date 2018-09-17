'use strict';

const pg = require('pg');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

const conString = process.env.DATABASE_URL ||
  'postgres://postgres:postgrespassword@localhost:5432/task_app';
const client = new pg.Client(conString);
client.connect();
client.on('error', error => {
  console.error(error);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.get('/', (request, response) => {
  response.send('server is working!');
});


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
