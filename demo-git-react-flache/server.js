const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(cors());
app.use(bodyParser.json());

app.use('/graphql', (req, res, next) => {
  console.log('REQ.BODY IS A: ', typeof req.body);
  fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { "Content-Type": "application/graphql", "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d" },
    body: JSON.stringify(req.body),
  })
    .then(resp => resp.json())
    .then(resp => res.json(resp))
    .catch(err => console.error('ERROR: ', err));
});

app.use(express.static(path.join(__dirname, './dist')));

app.get('/', (req, res) => res.sendFile('./dist/index.html'));

app.listen(4001, () => console.log('Listening on 4001...'));