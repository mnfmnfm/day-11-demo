'use strict';

const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT;
const app = express();

const superagent = require('superagent');

const methodOverride = require('method-override')

const tasks = require('./tasks');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.set('view engine', 'ejs');

// superagent adventures: nfl arrest api
app.get('/nflarrests', (request, response) => {
  superagent.get('http://nflarrest.com/api/v1/crime')
    .end(function (err, apiResponse) {
      if (err) {
        console.log(err);
      } else {
        console.log(apiResponse.body);
        response.render('nflarrests', {
          arrests: apiResponse.body
        });
      }
    });
});
// tasks index: all the tasks
app.get('/', (req, res) => res.redirect('/tasks'));
app.get('/tasks', tasks.getTasks);

app.get('/tasks/newform', (request, response) => {
  response.render('newtask');
});

app.get('/tasks/search', (request, response) => {
  console.log(request.query.query);
  superagent.get('http://super-crud.herokuapp.com/todos')
    .end( (err, apiResponse) => {
      console.log(apiResponse.body.todos);
      let tasks = apiResponse.body.todos.map(todo => ({title: todo.body, done: todo.completed}));
      response.render('searchresults', {tasks: tasks});
    })
});

// tasks show: details about one task
app.get('/tasks/:id', tasks.getOneTask);

// tasks create: make a new task
app.post('/tasks', tasks.createTask);

app.delete('/tasks/:id', tasks.deleteOneTask);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
