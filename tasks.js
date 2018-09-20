'use strict';


const pg = require('pg');

const conString = process.env.DATABASE_URL;
const client = new pg.Client(conString);
client.connect();
client.on('error', error => {
  console.error(error);
});
// helper functions
function getTasks(request, response) {
  client.query('SELECT * FROM tasks;')
    .then( (result) => {
      response.render('index', {
        pageTitle: 'Todos BUT UPDATED',
        tasks: result.rows
      });
    });
}

function getOneTask(request, response){
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
}

const createTask = (request, response) => {
  console.log('got a post!');
  let SQL = 'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING id;';
  let values = [request.body.title, !!request.body.done];

  client.query(SQL, values, (err, result) => {
    console.log(result);
    response.redirect(`/tasks/${result.rows[0].id}`);
  });
}

module.exports = {
  getTasks: getTasks,
  getOneTask: getOneTask,
  createTask: createTask
};
