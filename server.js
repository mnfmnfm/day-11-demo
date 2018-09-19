'use strict';

const express = require('express');
require('dotenv').config()

const PORT = process.env.PORT;
const app = express();


const tasks = require('./tasks');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));


app.set('view engine', 'ejs');

// tasks index: all the tasks
app.get('/', (req, res) => res.redirect('/tasks'));
app.get('/tasks', tasks.getTasks);

// tasks show: details about one task
app.get('/tasks/:id', tasks.getOneTask);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
