# FlascheQL

FlacheQL is a fast, light weight client caching library for GraphQL.

## Features

* Full cache
* Partial cache
* minimize network latency
* decrease data charges for the data transer
* downside- cache does not persist

## Cache Examples

**Full Cache:**
 All HTTP requests from the browser are first routed to the browser cache.  If it recognizes that the exact same query was made, then the previously fetched resource is read from the cache.

**Partial Cache:**

* Retrieves partial match from cache and fetches only the portion of the query that needs to be retrieved
* The browser cache identifies subset that is a subset 

## Getting Started

### Installing

`npm install --save flacheQL`

### Usage
```
const flacheQL = require('flacheql')
const client = new FlacheQL();`
```


## Demo



## Contributing