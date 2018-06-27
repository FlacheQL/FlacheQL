[Build Status](https://img.shields.io/travis/FlacheQL/FlacheQL.svg)

# FlacheQL

FlacheQL is a __*fast, lightweight, and flexible*__ client-side cache for GraphQL.

## Why use FlacheQL?

FlacheQL offers partial retrieval of cached data based on search parameters — a feature that no other GraphQL library offers. Larger implementations like Apollo and Relay can only cache data based on GraphQL query fields. With minimal set up, you can customize FlacheQL to your app's needs by toggling fieldRetrieval and/or paramRetrieval in the options: 

```javascript

======== partial retrieval on parameters ========       ======== partial retrieval on fields ========

    search(location: “Venice” limit: *25*) {	          search(location: “Venice” limit: 25) {	
      business {					    business {						
        name					              *name*
        rating					              *rating*
      }						            }
    }						          } 

    search(location: “Venice” limit: *10*) {	          search(location: “Venice” limit: 25) {	
      business {					    business {						
        name					              *rating*
        rating					            }      
      }						          }  
    }						          

```

FlacheQL consistently outperforms Apollo on retrievals of response data from identical queries as well as on both types of partial retrievals.  


*This is a work in progress.  Cache persistence and "smart" expiration of cached items are some of the features considered to be added.*

### Cache Examples

All HTTP requests from a browser are first routed to the browser cache.

**Full Cache:**

* If it recognizes a request as an exact same query that was previously made, then the matching response reads from the cache.

**Partial Cache:**

* If a request is a subset of a query that was previously made, then it reads the matching response from cache.

* If a request consists of a previous query and a new query, then it reads the matching response from cache and fetches the new query from the data source.

## Getting Started

### Installing

Install the module with npm install flacheQL or place into your package.json and run npm install.

```
npm install --save flacheQL
```

### Usage

Initialize FlacheQL.
```javascript
import Flache from 'flacheql'
const yourCache = new Flache(endpoint, headers, options);
```

Set up the options on initialization, by passing in config objects.

For example:
```javascript
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
      pathToNodes: 'data.search.edges', // the path to the array in the response
      // if you have a field which does not translate directly to its parameter,
      // the path to that data from the its parent array must be specified:
      queryPaths: { stars: 'node.stargazers.totalCount' },
    };
```

More information on configuration....

## Demo
http://www.flacheql.io/
