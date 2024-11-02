const fs = require("node:fs");
const express = require('express');
const nunjucks = require('nunjucks');
require('dotenv').config();

const app = express();
const appPort = process.env.APP_PORT;
const dataFile = process.env.DATA_FILE

nunjucks.configure('src/views', {
  autoescape: true,
  express: app,
});

app.use('/static', express.static('node_modules/bootstrap/dist'));
app.use('/static/icons', express.static('node_modules/bootstrap-icons'));

data = JSON.parse(fs.readFileSync(dataFile).toString('utf-8'));

app.get('/', (req, res) => {
  res.render('pages/home.njk', { subscriptions: data });
});

app.get('/series', (req, res) => {
  res.render('pages/series.njk', { subscriptions: data });
});

app.get('/users', (req, res) => {
  res.render('pages/users.njk', { subscriptions: data });
});

app.listen(appPort, () => {
  console.log(`Example app listening on port ${appPort}`);
});
