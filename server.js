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

app.get('/tasks/newform', (request, response) => {
  response.render('newtask');
});

// tasks show: details about one task
app.get('/tasks/:id', tasks.getOneTask);

// tasks create: make a new task
app.post('/tasks', tasks.createTask);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
