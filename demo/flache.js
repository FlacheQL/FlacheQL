import cleanQuery from "./helpers/cleanQuery";
import constructQueryChildren from "./helpers/constructQueryChildren";
import constructResponsePath from "./helpers/constructResponsePath";
import createCallbacksForPartialQueryValidation from "./helpers/createCallbacksForPartialQueryValidation";
import denormalize from "./helpers/denormalize";
import flatten from "./helpers/flatten";

export default class Flache {
  // TODO: have these parameters set-up on initialization rather than on each query
  constructor(endpoint, headers = { "Content-Type": "application/graphql" }, options) {
    this.cache = {};
    this.queryCache = {};
    this.fieldsCache = [];
    this.cacheLength = 0;
    this.cacheExpiration = 1000 * 120;
    this.cbs;
    this.endpoint = endpoint;
    this.options = options;
    this.headers = headers;
  }

  /**
   * Saves all Flache data to browser session storage for cache persistence. Purges after 200 seconds.
   */
  saveToSessionStorage() {
    // Object.keys(this).forEach(key =>
    //   sessionStorage.setItem(key, JSON.stringify(this[key]))
    // );
    // setTimeout(() => sessionStorage.clear(), 200000);
  }

  /**
   * Grabs any relevant Flache data from browser session storage.
   */
  readFromSessionStorage() {
    // Object.keys(this).forEach(key => {
    //   if (sessionStorage.getItem(key))
    //     this[key] = JSON.parse(sessionStorage.getItem(key));
    // });
  }

  it(query, variables) {
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
    if (!this.cbs) {
      this.cbs = createCallbacksForPartialQueryValidation(this.options.subsets);
    }

    // create a boolean to check if all queries are subsets of others
    let allParamsPass = false;

    // increment cache length
    this.cacheLength = Object.keys(this.cache).length;
    // if the developer specifies in App.jsx
    if (this.options.paramRetrieval) {
      let childrenMatch = false;
      // check if query children match 
      console.log('fields cache', this.fieldsCache);
      childrenMatch = this.fieldsCache.some(obj => {
        let objChildren = Object.values(obj)[0].children;
        return (
          objChildren.every(child => this.children.includes(child)) &&
          this.children.every(child => objChildren.includes(child))
        );
      });

      console.log(childrenMatch, 'HEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHERE')
      // no need to run partial query check on first query
      console.log('children match', childrenMatch)
      if (childrenMatch) {
        if (this.cacheLength > 0) {
          let currentMatchedQuery;
          for (let key in variables) {
            for (let query in this.queryCache[key]) {
              console.log('thing1', variables[key])
              console.log('thing2', this.queryCache[key][query])
              console.log('thing3', this.cbs[this.options.subsets[key]])
              console.log('result', this.cbs[this.options.subsets[key]](
                variables[key],
                this.queryCache[key][query]
              ))
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
              console.log('current query cache', this.queryCache)
              for (let currentKey in this.queryCache) {
                // skip the first key since this is the one that just matched
                console.log('im key', key)
                console.log('im current', currentKey)
                console.log('variables', variables)
                
                if (key === currentKey) continue;
                console.log('im current rule', this.options.subsets[currentKey])
                /* run the value on that query on each callback 
                such that if the callback of the current symbol passes
                given the current query variable as the first argument, 
                and the cached value on the current matched query key as the second,
                the queriesPass boolean is set to the return value of the callback */
                let rule = this.options.subsets[currentKey];
                let arg1 = variables[currentKey];
                console.log('arg1', arg1)
                let arg2 = this.queryCache[currentKey][currentMatchedQuery];
                console.log('arg2', arg2)
                let result = this.cbs[rule](arg1, arg2);
                
                console.log('thiscbsrule', this.cbs[rule])
                console.log('result', result)
                if (result) {
                  allParamsPass = result;
                } else {
                  allParamsPass = false;
                  break;
                }
              }

              if (allParamsPass) {
                console.log('this cache matched query', this.cache[currentMatchedQuery])
                let pathToNodes = this.options.pathToNodes;

                let cached = JSON.parse(JSON.stringify(this.cache[currentMatchedQuery]));
                let { path, lastTerm } = constructResponsePath(
                  pathToNodes,
                  cached
                );

                for (let key in this.options.queryPaths) {
                  console.log('subsets', this.options.subsets)
                  console.log(this.options.subsets)
                  console.log('key in query path loop', key)
                  console.log('query paths', this.options.queryPaths)
                  path[lastTerm] = path[lastTerm].filter(el => {
                    let { path, lastTerm } = constructResponsePath(
                      this.options.queryPaths[key],
                      el
                    );
                    // console.log(this.cbs)
                    return this.cbs[this.options.subsets[key]](
                      path[lastTerm],
                      variables[key]
                    );
                  });
                }

                for (let key in this.options.subsets) {
                  console.log('checking options')
                  if (
                    this.options.subsets[key] === 'first' ||
                    this.options.subsets[key] === 'last' ||
                    this.options.subsets[key] === 'limit'
                  ) {
                    // console.log('im key', key)
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
      this.fieldsCache.forEach(node => {
        console.log('im up in there')
        if (node.hasOwnProperty(this.queryParams)) {
          console.log('thischildren', this.children)
          foundMatch = this.children.every(child => {
            console.log('nodechidlren', node[this.queryParams].children)
            return node[this.queryParams].children.includes(child);
          });
          console.log('im up in here,', foundMatch)
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
    // console.log('cache', this.cache)
    // console.log('fieldscache', this.fieldsCache)
    // console.log('querycache', this.queryCache)
    return this.fetchData(query, this.endpoint, this.headers, stringifiedQuery);
    
  }

  fetchData(query, endpoint, headers, stringifiedQuery) {
    return new Promise((resolve, reject) => {
      fetch(endpoint, {
        method: "POST",
        headers,
        body: query
      })
      .then(res => {
        return res.json()})
      .then(res => {
        // console.log('THIS IS normalized data', flatten(res))
        this.cache[stringifiedQuery] = res;
        let normalizedData = flatten(res);
          this.fieldsCache.push({
            [this.queryParams]: {
              data: normalizedData,
              children: constructQueryChildren(query)
            }
          });
          console.log('stringified fields cache', this.fieldsCache)
          setTimeout(
            () => delete this.cache[stringifiedQuery],
            this.cacheExpiration
          );
          console.log('LOGGING RES', res)
          resolve(res);
          if (this.options.resultsVariable) {
            // ADD PROPERTY ON QUERY IN CACHE TO INDICATE WHETHER NUMBER OF RETURNED RESULTS IS GREATER THAN MAX
          }
        })
        .catch(err => err);
    });
  }
}
