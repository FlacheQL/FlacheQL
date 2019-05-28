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
    this.headers = headers;

    // ! TEST
    this.refreshCache = function () {
      // return the "data"-keyed object from indexDB using localForage
      console.log("Attempting to refresh CFQ from IDB...");

      localforage.getItem('FlacheQL', (err, value) => {
        console.log("RESPONSE");
        if (err) {
          // console.log("IDB error getting data from IDB")
          return false;
        } else {
          if (!value) {
            // console.log("No data returned from IDB call");
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
            return true;
          }
        }
      });
    }
    // this.refreshCache();
  }


  // ! On Instantiation: Attempt to reload CFQ from IndexedDB via LocalForage
  // refreshCache() {
  //   // return the "data"-keyed object from indexDB using localForage
  //   localforage.getItem('FlacheQL', (err, value) => {
  //     if (err) {
  //       console.log("error getting data ")
  //       return false;
  //     } else {
  //       this.cache = value.data.cache;
  //       this.queryCache = value.data.queryCache;
  //       this.fieldsCache = value.data.fieldsCache;
  //       return true;
  //     }
  //   });
  // }


  /**
   * Saves all Flache data to browser session storage for cache persistence. Purges after 200 seconds.
   */
  saveToSessionStorage() {
    Object.keys(this).forEach(key =>
      sessionStorage.setItem(key, JSON.stringify(this[key]))
    );
    setTimeout(() => sessionStorage.clear(), 200000);
  }

  /**
   * Grabs any relevant Flache data from browser session storage.
   */
  readFromSessionStorage() {
    Object.keys(this).forEach(key => {
      if (sessionStorage.getItem(key))
        this[key] = JSON.parse(sessionStorage.getItem(key));
    });
  }

  // checkIfRefreshNeeded() {
  //   if (!this.fieldsCache.length && !Object.keys(this.cache).length && !Object.keys(this.queryCache).length) {
  //     return  this.refreshCache();
  //   }
  // }

  it(query, variables) {

    if (!this.fieldsCache.length && !Object.keys(this.cache).length && !Object.keys(this.queryCache).length) {
      this.refreshCache();
    }

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

    console.log("About to populate query cache");
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
      this.fieldsCache.forEach(node => {
        if (node.hasOwnProperty(this.queryParams)) {
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
      }

    } else {
      //if partial retrieval is off, return cached object or fetchData
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
          this.cache[stringifiedQuery] = res;
          let normalizedData = flatten(res);

          let fieldCacheObj = {
            [this.queryParams]: {
              data: normalizedData,
              children: constructQueryChildren(query)
            }
          }

          if (!this.fieldsCache.some(obj => {
              return JSON.stringify(obj) === JSON.stringify(fieldCacheObj);
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
        return false;
      } else {
        console.log("No error setting item in localforage")
        return true;
      }
    })
  }



}