CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(256),
  done BOOLEAN
);

DELETE FROM tasks;

INSERT INTO tasks (title, done) VALUES ('teach ejs lecture', FALSE);
INSERT INTO tasks (title, done) VALUES ('finish displaying things with ejs', FALSE);
INSERT INTO tasks (title, done) VALUES ('loops', FALSE);
