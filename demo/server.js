#!/usr/bin/env node
// hello world!
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

const port = 8000;

const yelpAPI = "https://api.yelp.com/v3/graphql";

app.use(bodyParser.text());
app.use(cors());
app.use(express.static(path.join(__dirname, './dist')));


app.get('/', (req, res) => res.sendFile('./dist/index.html'));

// workaround for yelp CORS issue
app.post('/yelp', (req, res) => {
  console.log("TYPEOF ", typeof req.body);
  console.log("REQ: ", req.body);
  const { body } = req;
  fetch(yelpAPI, {
    headers: {
      "Content-Type": "application/graphql",
      "Authorization": "Bearer 1jLQPtNw6ziTJy36QLlmQeZkvvEXHT53yekL8kLN8nkvXudgTZ_Z0-VVjBOf483Flq-WDxtD2jsuwS8qkpkFa08yOgEAKIchAk2RI-avamh9jxGyxhPxgyKRbgIwW3Yx"
    },
    method: 'POST',
    body,
  }).then(resp => resp.json()).then(data => res.json(data));
});

app.listen(port, () => console.log(`Listening on ${port}...`));