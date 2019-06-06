[![npm](https://img.shields.io/npm/v/flacheql.svg)](https://www.npmjs.com/package/flacheql)
[![Build Status](https://img.shields.io/travis/FlacheQL/FlacheQL.svg)](https://travis-ci.org/FlacheQL/FlacheQL)

# FlacheQL

FlacheQL is a __*fast, lightweight, and flexible*__ client-side cache for GraphQL.

## Why use FlacheQL?

FlacheQL offers partial retrieval of cached data based on search parameters — a feature that no other GraphQL library offers. Larger implementations like Apollo and Relay can only cache data based on GraphQL query fields. With minimal set up, you can customize FlacheQL to your app's needs by toggling fieldRetrieval and/or paramRetrieval in the options: 

```javascript
===== partial retrieval on parameters =====
  search(location: "Venice" limit: 25) {
    business {
      name 
      rating 
    }
  }

  search(location: "Venice" limit: 10) {
    business {
      name 
      rating
    }
  }
```

```javascript
===== partial retrieval on fields =====
  search(location: "Venice" limit: 25) {
    business {
      name 
      rating 
    }
  }

  search(location: "Venice" limit: 25) {
    business {
      rating
    }
  }
```

```javascript
===== partial retrieval on supersets of fields =====
  search(location: "Venice" limit: 25) {
    business {
      name 
      rating 
      distance
      phone number
    }
  }

  search(location: "Venice" limit: 25) {
    business {
      distance
      phone number
    }
  }
  /*returned to the user are name and rating results from the cache,
  and distance and phone number results from the server*/
```

FlacheQL consistently outperforms Apollo on retrievals of response data from identical queries as well as on both types of partial retrievals.  


*This is a work in progress.  Cache persistence, expiration of cached items, and "superset" partial querying are some of the recently added features. In the future, we're looking to add a Higher Order Component (HOC) in React similar to that provided by Apollo. Please let us know if you'd like to contribute towards this goal!*

### Cache Examples

All HTTP requests from a browser are first routed to the browser cache under the hood.

**Full Cache:**

* If it recognizes a request as an exact same query that was previously made, then FlacheQL reads the matching response from the cache.

**Partial Cache:**

* If a request is a parameter or field subset of a query that was previously made, then FlacheQL reads the matching response from cache.

**Superset Partial Cache:**

* If a request is a match on parameters and represents a field __superset__ of the past query, FlacheQL reconstructs the outbound query to only fetch the additionally needed fields, before stitching back together the query response document on the client side. This results in fewer invocations of resolvers on the client side, reducing the load on servers and databases. Combined with a properly-configured TTL based on your application needs, you can expect that the constructed response document is reasonably fresh. 

## Getting Started

Install the module with npm install flacheQL or place into your package.json and run npm install.

```
npm install --save flacheQL
```

### Usage

To initialize FlacheQL, simply import the npm package and declare a new instance of Flache, passing in your GraphQL endpoint, any optional headers, and any optional configurations. If you only pass in an endpoint, FlacheQL will default to "Content-Type": "application/graphql". 


```javascript

import Flache from 'flacheql'
const endpoint = 'https://<yoursite>.com/graphql';
const yourCache = new Flache(endpoint);

// OR
import Flache from 'flacheql'
const endpoint = 'https://<yoursite>.com/graphql';
const headers = { "Content-Type": "application/graphql", "Authorization": "token <SOMETOKEN>" }
const yourCache = new Flache(endpoint, headers);

```

Every GraphQL query will go to through the FlacheQL cache, and if a new incoming query is identical to a past query, it will automatically be returned from the cache. In order to make an API call or retrieve data from the cache, simply pass in your queries into the it() function like so. Let's use a query to the Github GraphQL API as an example. We'll be searching for all repositories that match 'react', that use 'javascript', and that have over 10,000 stars. We'll then grab the first 50 results (Github caps the number we can fetch to 100). All we do is define our query and pass it into the it function, which is called on the cache that we initialized above. 

```javascript
const query1 = 
  `{
    search(query: "react language:javascript stars:>10000, type: REPOSITORY, first: 50) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            name
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
          }
        }
      }
    }
  }`
  
yourCache.it(query1)
         .then(res => 
           // do stuff with the response
         )
```

### Partial Retrieval on Parameters

The above set up is all we need to start caching queries with FlacheQL, but to get the most of the cache, we should set up some query variables. One of the features unique to FlacheQL is the ability to retrieve data from the cache when a query is a subset of another query. Of course, the difficulty with this kind of caching is that the data ultimately determines what kind of numbers determine subsets. In other words, a query to the Github API that fetches only the first 50 results, followed by the same query asking for only the first 30 results should come from the cache. But in order for this type of caching to work, we need to let FlacheQL know that as the number on the 'first' parameter decreases, we get subsets. In the case of the starcount, the opposite is true. If we search for all repositories that match 'react' and use 'javascript' with at least 30,000 stars, we'll get 7 results back. If we run the same query with at least 50,000 stars, we'll get 4 results. Those results will come from the cache just as long as we tell our cache that as the star count increases—all else equal—the cache should consider that to be a subset. 

The set up is simple. For each parameter, we'll first have to declare a variable and pass each of those into our queries. Here is what our new query will look like after we pass in variables instead of hardcoding the parameters. Assuming that the queries are coming from the front-end, we'll have a few ternary operators to set those params to empty strings in case some are left out:

```javascript
const queryWithVars = 
 `{
    search(query: ${tags || ''}${languages ? ' language:' + languages : ''}${stars ? ' stars:>' + stars : ''}, type: REPOSITORY, first: ${first}) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            name
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
          }
        }
      }
    }
  }`
  
yourCache.it(queryWithVars)
         .then(res => 
           // do stuff with the response
         )
```

Now, whatever we pass into our text inputs on the front end will be passed to our it() function. But in order for the cache to know what determines a subset for a certain parameter, we need to define those subsets in our options. Let's pass in the third optional parameter when we declare our instance of Flache. 

For example:
```javascript
    const yourCache = new Flache(endpoint, headers, options);

    const options = {
      paramRetrieval: true, // toggle subset retrieval on parameters
      ttl: 600000, // Time-to-Live for cached queries (ms)
      subsets: {
        tags: '=',
        languages: '=',
        stars: '>= number',
        first: '<= number',
      },
      pathToNodes: 'data.search.edges', 
        // the path to the array in the response
        // if you have a field which does not translate directly to its parameter,
        // the path to that data from the its parent array must be specified:
      queryPaths: { 
        stars: 'node.stargazers.totalCount' 
      },
    };
```

There are a four steps to get parameter caching working. First, we turn paramRetrieval to true. We then define a subsets property on our options object and set the value to be an object where we define all the subsets. Each of the query variables is then given a particular 'rule'. The rules are what determine whether FlacheQL should retrieve data from the cache or make new fetch calls each time a new query comes in. An '=' means that the tags and the languages need to be exact matches. '>= number' means that when the stars are greater than or equal to a number from a past query, data should come from the cache. '<= number' means that as the 'first' variable decreases, data should come from the cache. Other options are '<= string' and '>= string' which will return from the cache when a query with two words is a subset of a query with one of those words, or vice versa. For example, searching a movie database for the genres 'horror thriller' may return more results than a search on that database for only the genre 'horror'. This would be a great opportunity for caching. In that case, the 'genre' variable will be given the '<= string' rule in order to tell FlacheQL that as the string decreases (and contains the same elements as previous queries), data should come from the cache. We could also imagine a situation wherein the opposite scenario is true. For example, a GraphQL API that searches for cars may consider "convertible four-door SUV" to be a subset of "convertible". In that case, as the string increases (and contains the same elements as previous queries), data should come from the cache.

The last piece of the puzzle is telling the cache where to grab the data. Every GraphQL server is set up in a unique way by the developers. Github, for example, returns the star count for every repository as a property stargazers with a property totalCount, with the starcount as the value of that property. In our example above, the cache can only know to go find that starcount and filter out results with greater than 50,000 stars if we tell if where to find that information. First, we define a path to nodes to tell the cache where all the data lies. We then define query paths for each variable that requires a path. In this case, only the star count will need a path since the other parameter to cache on, 'first', is just the number of elements that will come back in our array of data. FlacheQL will automatically know that parameters like 'first,' 'last,' and 'limit', will never need query paths.


### Partial Retrieval on Fields

Finally, FlacheQL offers another type of partial retrieval. This kind of partial fetching is built into other libraries like Apollo and Relay. All we need to turn on partial retrieval on fields is another property in our options object. Let's look at an example. 

```javascript
    const yourCache = new Flache(endpoint, headers, options);

    const options = {
      paramRetrieval: true, // toggle partial retrieval on parameters
      fieldRetrieval: true  // toggle partial retrieval on fields *********************
      subsets: {
        tags: '=',
        languages: '=',
        stars: '>= number',
        first: '<= number',
      },
      pathToNodes: 'data.search.edges', 
        // the path to the array in the response
        // if you have a field which does not translate directly to its parameter,
        // the path to that data from the its parent array must be specified:
      queryPaths: { 
        stars: 'node.stargazers.totalCount' 
      },
    };
```

First, we set fieldRetrieval to true in our options object above. Then we'll modify our query to potentially include another field 'createdAt'. 

```javascript
const queryWithVars = 
 `{
    search(query: ${tags || ''}${languages ? ' language:' + languages : ''}${stars ? ' stars:>' + stars : ''}, type: REPOSITORY, first: ${first}) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            name
            ${createdAt ? createdAt : ''} // add optional fields *************************
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
          }
        }
      }
    }
  }`
  
yourCache.it(queryWithVars)
         .then(res => 
           // do stuff with the response
         )
```

One of the unique features of FlacheQL's cache is the ability to handle partial retrievals on both parameters and fields at the same time. In other words, if we want to get back the name, stars, forks, and createdAt fields of the repositories we search for, followed by the same search for just name, stars and forks, FlacheQL will retrieve that data from the cache and exclude the createdAt field. But more importantly, when we search for all repositories that match 'react', 
'javascript', '30000 stars', 'first 50 results' with the fields: name, stars, forks, createdAt, and then we run another query for all repositories that match 'react', 'javascript', '50000 stars', 'first 20 results' with the fields: name, stars—FlacheQL will interpret the second query to be a subset both on the parameters and the fields, and retrieve that data from the cache. 

### Persistent Storage in FlacheQL
FlacheQL uses IndexedDB, a JS-based object-oriented database that runs in your browser, as a way of persisting cached data between sessions. Whenever you run a query through Flache, the appropriate data structures from IndexedDB are loaded into memory if available. FlacheQL then checks whether any of the past queries have expired based the TTL set in the options configuration object -- if a past query is expired, its information is removed from the cache. Before returning a response to users, FlacheQL writes our cache data structures to our persistent memory in IndexedDB.

## Demo
Check out our revised demo below to make queries to the Github API and check out how the cache performs against Apollo!
http://www.flacheql.io/

## Issues
If you find an [issue](https://github.com/FlacheQL/FlacheQL/issues) let us know! We're always looking for both first-time contributors and veterans of OSS.

