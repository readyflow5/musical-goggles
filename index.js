var pg = require('pg');
var express = require('express');
var cors = require('cors');
var chatbot = express();

pg.defaults.ssl = true;
db = new pg.Client(process.env.DATABASE_URL);
db.connect();
query = db.query('CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, content TEXT)');
query.on('end', function() {
  console.log('db:initialized');
});

chatbot.use(cors());
chatbot.use(function(req, res, next) {
  req.body = '';
  req.on('data', function(chunk) { 
    req.body += chunk;
  });
  req.on('end', function() {
    next();
  });
});

chatbot.get('/last', function(req, res) {
  db.query('SELECT * FROM "comments" ORDER BY "id" DESC LIMIT 10', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

chatbot.get('/count', function(req, res) {
  db.query('SELECT COUNT(*) FROM "comments"', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

chatbot.get('/ping', function(req, res) {
  res.send('pong');
});

chatbot.get('/all', function(req, res) {
  db.query('SELECT * FROM "comments" ORDER BY "id" DESC', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

chatbot.post('/', function(req, res) {
  db.query('INSERT INTO "comments" (content) VALUES($1)', [req.body], function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.send('true');
    }
  });
});

chatbot.listen(process.env.PORT || 3000, function() {
  console.log('chatbot:initialized');
});
