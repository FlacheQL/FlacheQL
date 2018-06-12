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

cache.it(query, endpoint)
     .then(res => {
       /* Do stuff with the query response */
    });
```

If additional headers are needed, for example if your endpoint requires authorization, cache.it can take an optional headers parameter. 

```js
const headers = { "Content-Type": "application/graphql", "Authorization": "token _your token here_" };

cache.it(query, endpoint, headers)
     .then(res => {
       /* Do stuff with the query response */
    });
    
// If no headers are provided, the default value is:
{ "Content-Type": "application/graphql" }  
```
