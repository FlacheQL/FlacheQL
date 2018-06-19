<<<<<<< HEAD:demo-git-react-flache/server.js
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const app = express();
// const bodyParser = require('body-parser');
// const fetch = require('node-fetch');
=======
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const http = require('http');


>>>>>>> c48d76fe2c188828f4837be5d8f34651ca5b32b0:demo/server.js

// app.use(cors());
// app.use(bodyParser.json());

<<<<<<< HEAD:demo-git-react-flache/server.js
// app.use('/graphql', (req, res, next) => {
//   console.log('REQ.BODY IS A: ', typeof req.body);
//   fetch('https://api.github.com/graphql', {
//     method: 'POST',
//     headers: { "Content-Type": "application/graphql", "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d" },
//     body: JSON.stringify(req.body),
//   })
//     .then(resp => resp.json())
//     .then(resp => res.json(resp))
//     .catch(err => console.error('ERROR: ', err));
// });
=======
app.post('/graphql', (req, res, next) => {
  console.log('REQ.BODY IS A: ', typeof req.body);
  // console.log('about to server fetch, request body is: ', req);
  fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { "Content-Type": "application/graphql", "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d" },
    body: JSON.stringify(req.body),
  })
    .then(resp => {
      //console.log('RAW RESPONSE: \n\n', resp);
      return resp.json();
    })
    .then(resp => {
      //console.log('JSON RESPONSE: \n\n', res);
      console.log('handling response in server fetch');
      console.log(resp);
     res.json(resp)
    })
    .catch(err => console.error('ERROR: ', err));
});
>>>>>>> c48d76fe2c188828f4837be5d8f34651ca5b32b0:demo/server.js

// app.use(express.static(path.join(__dirname, './dist')));

// app.get('/', (req, res) => res.sendFile('./dist/index.html'));

// app.listen(4001, () => console.log('Listening on 4001...'));