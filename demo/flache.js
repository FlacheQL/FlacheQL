import cleanQuery from "./helpers/cleanQuery";
import constructQueryChildren from "./helpers/constructQueryChildren";
import constructResponsePath from "./helpers/constructResponsePath";
import createCallbacksForPartialQueryValidation from "./helpers/createCallbacksForPartialQueryValidation";
import denormalize from "./helpers/denormalize";
import flatten from "./helpers/flatten";
import localforage from "localforage"

export default class Flache {
  constructor(endpoint, headers = {
    "Content-Type": "application/graphql"
  }, options) {
    this.cache = {};
    this.queryCache = {};
    this.fieldsCache = [];
    this.cacheLength = 0;
    this.cbs;
    this.endpoint = endpoint;
    this.options = options;
    this.ttl = options.ttl || 300000; // Either passed in Time-To-Live (TTL) default value of 5 minutes.
    this.headers = headers;

    // ! A method to retrieve CFQ from the IndexedDB browser storage, and use it to refresh the in-memory CFQ.
    this.loadFromIndexedDB = function () {
      // return the "data"-keyed object from indexDB using localForage

      localforage.getItem('FlacheQL', (err, value) => {
        if (err) {
          return false;
        } else {
          if (!value) {
            return false;
          } else {
            this.cache = value.cache;
            this.queryCache = value.queryCache;
            this.fieldsCache = value.fieldsCache;
            return true;
          }
        }
      })

    }

    // A method to look through the in-memory CFQ and removes any stale past queries based on the TTL set in the "options" configuration object
    this.pruneStaleFromCache = function () {
      if (Object.keys(this.cache)) {
        const currentTime = Date.now(); // ex: 8759213 (seconds)
        for (let stringifiedQuery in this.cache) {
          let pastQueryTime = this.cache[stringifiedQuery].created_at;
          if (currentTime - pastQueryTime > this.ttl) {
            // Query is Expired... Need to remove the appropriate information from CFQ
            // Need to get the associated queryParams with the stale query
            let staleStringifiedQuery = stringifiedQuery;
            let staleQueryParams = cleanQuery(JSON.parse(staleStringifiedQuery));
            // 1: Delete the appropriate information from this.cache
            delete this.cache[staleStringifiedQuery];
            // 2: Delete the appropriate information from this.fieldsCache
            this.fieldsCache.forEach((fieldsCacheObj, index) => {
              if (staleQueryParams in fieldsCacheObj) {
                this.fieldsCache.splice(index, 1);
              }
            });
            // 3: Delete the appropriate information from this.queryCache
            for (let param in this.queryCache) {
              for (let stringifiedQuery in this.queryCache[param]) {
                if (stringifiedQuery == staleStringifiedQuery) {
                  delete this.queryCache[param][stringifiedQuery];
                }
              }
            }
          }
        }
      }
      return;
    }
  }



  it(query, variables) {

    // On Query, first load the CFQ from IndexedDB if appropriate. Then, prune your in-memory CFQ based on the TTL set in the "options" configuration object
    if (!this.fieldsCache.length && !Object.keys(this.cache).length && !Object.keys(this.queryCache).length) {
      this.loadFromIndexedDB();
    }
    this.pruneStaleFromCache();


    // create a key to store the payloads in the cache
    const stringifiedQuery = JSON.stringify(query);
    // return this.fetchData(query, this.endpoint, this.headers, stringifiedQuery)
    this.queryParams = cleanQuery(query);

    // create a children array to check params
    this.children = constructQueryChildren(query);

    // if an identical query comes in return the cached result
    if (this.cache[stringifiedQuery]) {
      return new Promise(resolve => {
        resolve(this.cache[stringifiedQuery]);
      });
    }

    // set boolean to check for partial queries, else skip straight to fetchData and return
    if (!this.options.paramRetrieval || !this.options.fieldRetrieval) return this.fetchData(query, stringifiedQuery);

    // returns an object of callback functions that check query validity using subset options
    if (!this.cbs) this.cbs = createCallbacksForPartialQueryValidation(this.options.subsets);

    // create a boolean to check if all queries are subsets of others
    let allParamsPass = false;

    // increment cache length
    this.cacheLength = Object.keys(this.cache).length;
    // if the developer specifies in App.jsx
    if (this.options.paramRetrieval) {
      let childrenMatch = false;
      // check if query children match 
      childrenMatch = this.fieldsCache.some(obj => {
        let currentChildren = Object.values(obj)[0].children;
        return this.children.every(child => currentChildren.includes(child));
      });

      if (childrenMatch) {
        // no need to run partial query check on first query, as for this Yelp demo we query for four fields automatically 
        if (this.cacheLength > 0) {
          let currentMatchedQuery;
          for (let key in variables) {
            for (let query in this.queryCache[key]) {
              if (
                this.cbs[this.options.subsets[key]](
                  variables[key],
                  this.queryCache[key][query]
                )
              ) {
                // if the callback returns true, set the currentMatchedQuery to be the current query
                currentMatchedQuery = query;
              } else {
                continue;
              }
              for (let currentKey in this.queryCache) {
                // skip the first key since this is the one that just matched
                if (key === currentKey) continue;
                /* run the value on that query on each callback 
                such that if the callback of the current symbol passes
                given the current query variable as the first argument, 
                and the cached value on the current matched query key as the second,
                the queriesPass boolean is set to the return value of the callback */
                let rule = this.options.subsets[currentKey];
                let arg1 = variables[currentKey];
                let arg2 = this.queryCache[currentKey][currentMatchedQuery]
                let result = this.cbs[rule](arg1, arg2);
                if (result) {
                  allParamsPass = result;
                } else {
                  allParamsPass = false;
                  break;
                }
              }

              if (allParamsPass) {
                let pathToNodes = this.options.pathToNodes;

                let cached = JSON.parse(JSON.stringify(this.cache[currentMatchedQuery]));
                let {
                  path,
                  lastTerm
                } = constructResponsePath(
                  pathToNodes,
                  cached
                );

                for (let key in this.options.queryPaths) {
                  path[lastTerm] = path[lastTerm].filter(el => {
                    let {
                      path,
                      lastTerm
                    } = constructResponsePath(
                      this.options.queryPaths[key],
                      el
                    );
                    return this.cbs[this.options.subsets[key]](
                      path[lastTerm],
                      variables[key]
                    );
                  });
                }

                for (let key in this.options.subsets) {
                  if (
                    this.options.subsets[key] === 'first' ||
                    this.options.subsets[key] === 'last' ||
                    this.options.subsets[key] === 'limit'
                  ) {
                    path[lastTerm] = path[lastTerm].slice(0, variables[key])
                  }
                }

                return new Promise((resolve, reject) => {
                  resolve(cached);
                });
              }

            }
          }
        }
      }
    }

    Object.keys(variables).forEach(queryVariable => {
      // if a key already exists on the query cache for that variable add a new key value pair to it, else create a new obj
      if (this.queryCache[queryVariable]) {
        this.queryCache[queryVariable][stringifiedQuery] =
          variables[queryVariable];
      } else
        this.queryCache[queryVariable] = {
          [stringifiedQuery]: variables[queryVariable]
        };
    });

    if (this.options.fieldRetrieval) {
      let filtered;
      let foundMatch = false;
      const matchingChildren = [];
      let sumOfMatchingChildren = 0;
      this.fieldsCache.forEach(node => {
        if (node.hasOwnProperty(this.queryParams)) {
          node[this.queryParams].children.forEach((child, i) => {
            if (this.children[i] === child) {
              sumOfMatchingChildren += 1;
            }
          })
          //assigning filtered here so that we have access to query that matched on arguments passed into the initial query parameters, but not completely on "children" (a.k.a fields)
          filtered = denormalize(node[this.queryParams].data);
          foundMatch = this.children.every(child => {
            return node[this.queryParams].children.includes(child);
          });
          if (foundMatch) {
            filtered = JSON.parse(JSON.stringify(node[this.queryParams].data));
            for (let key in filtered) {
              if (!this.children.some(child => key.includes(child))) {
                delete filtered[key];
              }
            }
          }
        }
      });

      if (foundMatch) {
        return new Promise(resolve => {
          filtered = denormalize(filtered);
          resolve(filtered);
        });
      };

      /*
      Note: "children" are query fields, nested fields will always be queried for. 
      
      sumOfMatchingChildren is used as a flag, specifically for this Yelp demo, the number of matching children between this.children (current query's children) and node[this.queryParams].children (prior query's children) needs to be above 4 as we query for name, rating, hours.is_open_now, and categories.title automatically. The number to check the flag against will dependent on your data.
      
      */

      if (!foundMatch && sumOfMatchingChildren > 4) {
        let activeQuery = query;
        const cachedDataToCompare = filtered;
        this.fieldsCache.forEach(node => {
          if (node.hasOwnProperty(this.queryParams)) {
            this.children.filter(child => {
              if (node[this.queryParams].children.includes(child)) {
                matchingChildren.push(child)

              }
            })
          }
        })
        matchingChildren.forEach(match => {
          if (activeQuery.includes(match)) {
            activeQuery = activeQuery.replace(match, '')
          }
        })
        return this.fetchPartialData(activeQuery, this.endpoint, this.headers, stringifiedQuery, cachedDataToCompare)
      }
    } else {
      //if partial retrieval is turned off, return cached object or fetchData
      if (this.cache[stringifiedQuery]) {
        return new Promise(resolve => {
          return resolve(this.cache[stringifiedQuery]);
        });
      } else {
        return this.fetchData(query, this.endpoint, this.headers, stringifiedQuery);
      }
    }
    return this.fetchData(query, this.endpoint, this.headers, stringifiedQuery);

  }

  //fetchPartialData will only be called if a query is a "superset" of a prior query

  fetchPartialData(query, endpoint, headers, stringifiedQuery, cachedData) {
    return new Promise((resolve, reject) => {
      fetch(endpoint, {
        method: "POST",
        headers,
        body: query
      })
        .then(res => {
          return res.json()
        })
        .then(res => {
          const mergedQueryResults = _.merge(cachedData, res);
          this.cache[stringifiedQuery] = mergedQueryResults;
          let normalizedData = flatten(mergedQueryResults);
          this.fieldsCache.push({
            [this.queryParams]: {
              data: normalizedData,
              children: constructQueryChildren(query)
            }
          })
          resolve(mergedQueryResults);
        })
        .catch(err => err);
    });
  };


  fetchData(query, endpoint, headers, stringifiedQuery) {
    return new Promise((resolve, reject) => {
      fetch(endpoint, {
        method: "POST",
        headers,
        body: query
      })
        .then(res => {
          return res.json()
        })
        .then(res => {
          // Assign a timestamp to the query being inserted into this.cache
          res.created_at = Date.now();
          this.cache[stringifiedQuery] = res;
          let normalizedData = flatten(res);

          let fieldCacheObj = {
            [this.queryParams]: {
              data: normalizedData,
              children: constructQueryChildren(query)
            }
          }

          if (!this.fieldsCache.some(obj => {
            return (Object.keys(obj)[0] === this.queryParams && JSON.stringify(obj[Object.keys(obj)[0]].children) == JSON.stringify(fieldCacheObj[this.queryParams].children))
          })) {
            this.fieldsCache.push(fieldCacheObj);
          }
          this.saveToIndexedDB();
          resolve(res);
        })
        .catch(err => err);
    });
  }

  // A method to save the current Cache, FieldCache, and QueryCache (CFQ) data structures in memory to IndexedDB using localforage, a higher-level API.
  saveToIndexedDB() {
    let data = {
      cache: this.cache,
      queryCache: this.queryCache,
      fieldsCache: this.fieldsCache
    }
    // data = JSON.stringify(data); // ! Added 6/3... turn the stingified storage object into an acutal object!
    localforage.setItem('FlacheQL', data, (err, result) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    })
  }
}