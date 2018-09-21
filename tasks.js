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
      response.render('show', {
        task: result.rows[0],
        potato: !!request.query.added });
    }
  })
}

const createTask = (request, response) => {
  console.log('got a post!');
  let SQL = 'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING id;';
  let values = [request.body.title, !!request.body.done];

  client.query(SQL, values, (err, result) => {
    console.log(result);
    response.redirect(`/tasks/${result.rows[0].id}?added=true`);
  });
}

const deleteOneTask = (request, response) => {
  client.query('DELETE FROM tasks WHERE id = $1', [request.params.id], () => {
    response.redirect('/tasks');
  })
};

const editTask = (request, response) => {
  client.query('SELECT * FROM tasks WHERE id = $1', [request.params.id], (err, result) => {
    response.render('edittask', {task: result.rows[0]});
  });
};

const updateTask = (request, response) => {
  let SQL = 'UPDATE tasks SET title=$1, done=$2 WHERE id = $3;';
  let values = [request.body.title, !!request.body.done, request.params.id];

  client.query(SQL, values, (err, result) => {
    response.redirect(`/tasks/${request.params.id}?added=true`);
  });
}

module.exports = {
  getTasks: getTasks,
  getOneTask: getOneTask,
  createTask: createTask,
  deleteOneTask: deleteOneTask,
  editTask: editTask,
  updateTask: updateTask
};
