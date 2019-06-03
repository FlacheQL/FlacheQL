import cleanQuery from "./helpers/cleanQuery";
import constructQueryChildren from "./helpers/constructQueryChildren";
import constructResponsePath from "./helpers/constructResponsePath";
import createCallbacksForPartialQueryValidation from "./helpers/createCallbacksForPartialQueryValidation";
import denormalize from "./helpers/denormalize";
import flatten from "./helpers/flatten";
import localforage from "localforage"

export default class Flache {
  // TODO: have these parameters set-up on initialization rather than on each query
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
    this.ttl = options.ttl || 300000; // ! Either passed in TTL or default to default value... CHANGE this later to a realistic default value
    this.headers = headers;

    // ! A method to retrieve CFQ from the IndexedDB browser storage, and use it to refresh the in-memory CFQ.
    this.loadFromIndexDB = function () {
      // return the "data"-keyed object from indexDB using localForage
      console.log("Attempting to refresh CFQ from IDB...");

      localforage.getItem('FlacheQL', (err, value) => {
        // console.log("RESPONSE");
        if (err) {
          // console.log("IDB error getting data from IDB")
          console.log("DONE WITH LoadFromINdexDB");
          return false;
        } else {
          if (!value) {
            // console.log("No data returned from IDB call");
            console.log("DONE WITH LoadFromINdexDB");
            return false;
          } else {
            // console.log("VALUE IS: ", value)
            // console.log("Assigning CFQ with values from cache ;)");
            this.cache = value.cache;
            this.queryCache = value.queryCache;
            this.fieldsCache = value.fieldsCache;
            // console.log("After LOADING FROM IDB, our C Q F are: ")
            // console.log("CACHE: ", this.cache);
            // console.log("QUERYCACHE: ", this.queryCache);
            // console.log("FIELDSCACHE: ", this.fieldsCache);
            console.log("DONE WITH LoadFromINdexDB");
            return true;
          }
        }
      })

    }

    // ! This method looks through the in-memory CFQ and removes any stale past queries.
    this.pruneStaleFromCache = function () {
      console.log("STARTING pruneStaleFromCache");
      if (Object.keys(this.cache)) {
        const currentTime = Date.now(); // ex: 8759213 (seconds)
        console.log("CURRENT TIME IS: ", currentTime, "... About to iterate through this.cache");
        for (let stringifiedQuery in this.cache) {
          let pastQueryTime = this.cache[stringifiedQuery].created_at;
          console.log("pastQueryTime is : ", pastQueryTime);
          if (currentTime - pastQueryTime > this.ttl) {
            console.log("STALE QUERY DETECTED! FOR: ", this.cache[stringifiedQuery]);
            console.log("Query is expired by: ", currentTime - pastQueryTime - this.ttl, "  milliseconds");
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

      console.log("DONE WITH PRUNESTALE");
      return;
    }


  }



  it(query, variables) {

    if (!this.fieldsCache.length && !Object.keys(this.cache).length && !Object.keys(this.queryCache).length) {
      this.loadFromIndexDB();
    }
    this.pruneStaleFromCache(); // ! This will run before loadFromIndexDB on the FIRST request, but clean the cache appropriately every query thereafter


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

    console.log("Do we want paramRetrieval? ", this.options.paramRetrieval);
    console.log("Do we want fieldRetrieval? ", this.options.fieldRetrieval);

    this.cacheLength = Object.keys(this.cache).length;
    // if the developer specifies in App.jsx
    if (this.options.paramRetrieval) {
      console.log("In paramRetrieval");
      let childrenMatch = false;
      // check if query children match 
      childrenMatch = this.fieldsCache.some(obj => {
        let currentChildren = Object.values(obj)[0].children;
        return this.children.every(child => currentChildren.includes(child));
      });

      if (childrenMatch) {
        // no need to run partial query check on first query
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
        console.log("WRITING TO QUERY CACHE A");
        this.queryCache[queryVariable][stringifiedQuery] =
          variables[queryVariable];
      } else
        console.log("WRITING TO QUERY CACHE B!");
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
          //assigning filtered here so that we have access to query that matched on fields, but not completely on children
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
      //sumOfMatchingChildren is used as a flag, specifically for this demo, the number of matching children between this.children (current query's children) and node[this.queryParams].children (prior query's children) needs to be above 4 as we query for name, rating, hours.is_open_now, and categories.title automatically. 
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
    console.log("Starting fetchData method for query: ", query);
    console.log("THIS CACHE IS : ", this.cache);
    console.log("THIS.FIELDSCACHE IS ", this.fieldsCache);
    console.log("THIS.QUERYCACHE IS : ", this.queryCache);
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
          // ! Assign a timestamp to the query being inserted into this.cache
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
              console.log("--- Comparing...")
              console.log(Object.keys(obj)[0] === this.queryParams && JSON.stringify(obj[Object.keys(obj)[0]].children) == JSON.stringify(fieldCacheObj[this.queryParams].children))
              // console.log("Existing: ", JSON.stringify(obj));
              // console.log("NEW: ", JSON.stringify(fieldCacheObj));
              // ! NOTE! They're trying to use JSON.stringify to check whether the active query exists in fieldscache, but this strategy doesn't work because the values in .data include a createdAt field that will be different for any query...
              // return JSON.stringify(obj) === JSON.stringify(fieldCacheObj); // ! THEIR METHOD

              console.log("Old Query Key: ", Object.keys(obj)[0]);
              console.log("New query Key: ", this.queryParams);
              console.log("Old query children: ", obj[Object.keys(obj)[0]].children);
              console.log("New Query Children: ", fieldCacheObj[this.queryParams].children);
              return (Object.keys(obj)[0] === this.queryParams && JSON.stringify(obj[Object.keys(obj)[0]].children) == JSON.stringify(fieldCacheObj[this.queryParams].children))
            })) {
            this.fieldsCache.push(fieldCacheObj);
          }
          console.log("PREPARING TO WRITE TO IDB WITH INMEMORY VALUES: ")
          console.log("CACHE: ", this.cache);
          console.log("QUERYCACHE: ", this.queryCache);
          console.log("FIELDSCACHE: ", this.fieldsCache);
          this.saveToIndexedDB();
          resolve(res);
        })
        .catch(err => err);
    });
  }

  saveToIndexedDB() {
    console.log("save to indexedDB")
    const data = {
      cache: this.cache,
      queryCache: this.queryCache,
      fieldsCache: this.fieldsCache
    }
    console.log("Data about to be saved is: ", data);
    localforage.setItem('FlacheQL', data, (err, result) => {
      if (err) {
        console.log("Error setting item in local forage for ", data);
        console.log("Index db error is : ", err);
        return false;
      } else {
        console.log("No error setting item in localforage")
        return true;
      }
    })
  }



}