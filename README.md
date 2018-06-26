# FlascheQL

FlacheQL is a __*fast, light weight*__ client caching library for GraphQL.

## Why use FlacheQL?

Third party solutions such as Apollo and Relay exist.  However, they are large frameworks that are heavy in build sizes, broadly scoped, and difficult to implement.

### Features

* Full cache
* Partial cache
* nomalized data structure that ensures minimum network latency 
* easy to implement

*This is a work in progress.  Cache persistence and "smart" expiration of cached items are some of the features considered to be added.*

### Cache Examples

All HTTP requests from a browser are first routed to the browser cache.

**Full Cache:**

* If it recognizes a request as an exact same query that was previously made, then the matching response reads from the cache.

**Partial Cache:**

* If a request is a subset of a query that was previously made, then it reads the matching response from cache.
    
    Example:

* If a request consists of a previous query and a new query, then it reads the matching response from cache and fetches the new query from the data source.
    
    Example:


## Getting Started

### Installing

Install the module with npm install flacheQL or place into your package.json and run npm install.
```
npm install --save flacheQL
```

### Usage

Initialize FlacheQL.
```
import Flache from 'flacheql'
const yourCache = new Flache(endpoint, headers, options);
```

Set up these parameters on initialization rather than on each query.

For example:
```
    const endpoint = 'https://<yoursite>.com/graphql';
    const headers = { "Content-Type": "application/graphql", "Authorization": "token <SOMETOKEN>" }
    const options = {
      fieldRetrieval: true, // toggle subset retrieval based on fields
      paramRetrieval: true, // toggle subset retrieval based on parameters (must be configured, as below):
      subsets: {
        terms: '=',
        languages: '> string',
        stars: '>= number',
        num: '<= number',
      },
      // the path to the array in the response:
      pathToNodes: 'data.search.edges',
      // if you have a field which does not translate directly to its parameter,
      // the path to that data from the must be specified:
      queryPaths: { stars: 'node.stargazers.totalCount' },
    };
```

More information on configuration....

## Demo
