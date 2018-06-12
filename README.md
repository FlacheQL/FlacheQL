# FlacheQL: A Lightweight Client-Side Cache for GraphQL

## Installation

From a terminal, run the following command to install the FlacheQL package:
`npm install --save flacheql`

## Implementation

Import FlacheQL with your other node modules:
```js
import { Flache } from 'flacheql'
const cache = new Flache();

const query = /* Define your GraphQL query. */
const endpoint = /* Define your GraphQL endpoint. */ 
const headers = /* Define the headers. */

new Promise((resolve, reject) => {
      resolve(cache.it(query, endpoint, headers))
    }).then(res => {
       /* Do stuff with the query response */
    });
```

