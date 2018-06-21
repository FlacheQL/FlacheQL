#!/usr/bin/env node
// hello!
const express = require('express');
const path = require('path');
const app = express();

const port = 8000;

app.use(express.static(path.join(__dirname, './dist')));

app.get('/', (req, res) => res.sendFile('./dist/index.html'));

app.listen(port, () => console.log(`Listening on ${port}...`));