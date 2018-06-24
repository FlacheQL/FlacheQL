import denormalize from './denormalize';

export default class Flache {
  constructor(props) {
    this.cache = {};
    this.queryCache = {};
    this.fieldsCache = [];
    this.cacheLength = 0;
    this.cacheExpiration = 1000 * 120;
    this.cbs;
    this.options = {
      paramRetrieval: false,
      fieldRetrieval: false,
      subsets: {},
    };
  }

  /**
  * Saves all Flache data to browser session storage for cache persistence. Purges after 200 seconds.
  */
  saveToSessionStorage() {
    Object.keys(this).forEach(key => sessionStorage.setItem(key, JSON.stringify(this[key])));
    setTimeout(() => sessionStorage.clear(), 200000);
  }

  /**
  * Grabs any relevant Flache data from browser session storage.
  */
  readFromSessionStorage() {
    Object.keys(this).forEach((key) => { if (sessionStorage.getItem(key)) this[key] = JSON.parse(sessionStorage.getItem(key)); });
  }

  it(
    query,
    variables,
    endpoint,
    headers = { "Content-Type": "application/graphql" },
    options
  ) {
    // create a key to store the payloads in the cache
    const stringifiedQuery = JSON.stringify(query);
    this.queryParams = this.cleanQuery(query);

    // create a children array to check params
    this.children = this.createChildren(query);
    console.log('query children: ', this.children);

    // if an identical query comes in return the cached result
    if (this.cache[stringifiedQuery]) {
      return new Promise((resolve) => {
        console.log('resolving from cache')
        resolve(this.cache[stringifiedQuery]);
      });
    }

    // set boolean to check for partial queries, else skip straight to fetch and return
    if (options.paramRetrieval) this.options.paramRetrieval = true;
    if (options.fieldRetrieval) this.options.fieldRetrieval = true;
    else return this.fetchData(query, endpoint, headers, stringifiedQuery);

    // save subsets to state
    if (options.defineSubsets) this.options.subsets = options.defineSubsets;

    // returns an object of callback functions that check query validity using subset options
    if (!this.cbs) {
        this.cbs = this.createCallbacksForPartialQueryValidation(
          this.options.subsets
        );
    }

    // create a boolean to check if all queries are subsets of others
    let allQueriesPass = false;

    // increment cache length
    this.cacheLength = Object.keys(this.cache).length;
    
    // if the developer specifies in App.jsx
    if (this.options.paramRetrieval) {
        let childrenMatch = false;
        //check if query children match
        childrenMatch = this.fieldsCache.some(obj => {
            let objChildren = Object.values(obj)[0].children
            return objChildren.every(child => this.children.includes(child)) && this.children.every(child => objChildren.includes(child))
        })
        // no need to run partial query check on first query
        if (childrenMatch) {
            if (this.cacheLength > 0) {
                let currentMatchedQuery;
                for (let key in variables) {
                    for (let query in this.queryCache[key]) {
                        if (this.cbs[this.options.subsets[key]](variables[key], this.queryCache[key][query])) {
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
                            let arg2 = this.queryCache[currentKey][currentMatchedQuery];
                            let result = this.cbs[rule](arg1, arg2);
      
                            // if the result of the callback is truthy, set the boolean to that value
                            if (result) {
                                allQueriesPass = result;
                            } else {
                                // reset the boolean and break out
                                allQueriesPass = false;
                                break;
                            }
                        }

                        if (allQueriesPass) {
                            let pathToNodes = options.pathToNodes;
                            let cached = Object.assign(this.cache[currentMatchedQuery], {});
                            let { path, lastTerm } = this.constructResponsePath(pathToNodes, cached)
            
                            for (let key in options.queryPaths) {
                            path[lastTerm] = path[lastTerm].filter(el => {
                                let { path, lastTerm } = this.constructResponsePath(options.queryPaths[key], el)
                                return this.cbs[this.options.subsets[key]](path[lastTerm], variables[key])
                            });
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
        this.fieldsCache.forEach((node) => {
            if (node.hasOwnProperty(this.queryParams)) {
                foundMatch = this.children.every(child => {
                    return node[this.queryParams].children.includes(child);
                })
                if (foundMatch) {
                    filtered = Object.assign({}, node[this.queryParams].data);
                    for (let key in filtered) {
                        if (!this.children.some(child => key.includes(child)) ) {
                            delete filtered[key];
                        }
                    }
                }
           }
        })

        if (foundMatch) {
            return new Promise((resolve) => {
                filtered = denormalize(filtered);
                console.log(filtered);
                resolve(filtered);
              });
        }
    } else {
        //if partial retrieval is off, return cached object or fetch
        if (this.cache[stringifiedQuery]) {
        return new Promise((resolve) => {
            return resolve(this.cache[stringifiedQuery]);
        });
        } else {
            return this.fetchData(query, endpoint, headers, stringifiedQuery);
        } 
    }
    return this.fetchData(query, endpoint, headers, stringifiedQuery);
  }
  

  fetchData(query, endpoint, headers, stringifiedQuery) {
    return new Promise((resolve, reject) => {
      fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query
        })
      })
        .then(res => res.json())
        .then(res => {
          this.cache[stringifiedQuery] = res;
          let normalizedData = this.flatten(res);
          this.fieldsCache.push({[this.queryParams]: {data: normalizedData, children: this.createChildren(query)}});
            console.log(res)
          setTimeout(
            () => delete this.cache[stringifiedQuery],
            this.cacheExpiration
          );
          resolve(res);
          if (this.options.resultsVariable) {
            // ADD PROPERTY ON QUERY IN CACHE TO INDICATE WHETHER NUMBER OF RETURNED RESULTS IS GREATER THAN MAX
          }
        })
        .catch(err => err);
    });
  }

  createCallbacksForPartialQueryValidation(subsets) {
    return Object.values(subsets).reduce((obj, subsetRule) => {
      let func;
      switch (subsetRule) {
        case "=":
          func = (str1, str2) => {
            return str1 == str2;
          };
          break;
        case "> string":
          func = (str1, str2) => {
            return str1.includes(str2);
          };
          break;
        case ">= number":
          func = (num1, num2) => {
            return num1 >= num2;
          };
          break;
        case "<= number":
          func = (num1, num2) => {
            return num1 <= num2;
          };
          break;
      }
      obj[subsetRule] = func;
      return obj;
    }, {});
  }

  constructResponsePath(pathString, object) {
    let terms = pathString.split(".");
    let lastTerm = terms.pop();
    let path = terms.reduce((acc, next) => {
      return acc[next];
    }, object);
    return { path, lastTerm }
  }

  cleanQuery(query) {
    let queryStr = JSON.stringify(query);
    let resultStr = queryStr.replace(/\s+/g, '  ').trim();
    resultStr = resultStr.replace(/\s+/g, ' ').trim();
    resultStr = resultStr.replace(/\\n/g, ' ');
    resultStr = resultStr.replace('/', '');
    resultStr = resultStr.replace(/\\/g, '');
    resultStr = resultStr.match(/\(.*\)/)[0];
    return resultStr;
  }

  flatten(object) {
    return Object.assign( {}, ...function _flatten( objectBit, path = '') {
      return [].concat(
        ...Object.keys( objectBit ).map(
          key => {
              return typeof objectBit[key] === 'object' ?
           _flatten( objectBit[key], `${path}.${key}`) : 
          ( { [`${ path }.${ key }` ]: objectBit[key]});
          }
        )
      )
    }(object));
  }

  createChildren(query) {
    let childArr = [];
    let splitQ = query.split('\n');
    splitQ.forEach((ele, index, array) => {
      if (index > 1) {
        if ( array[index - 1].includes('{') && array[index + 1].includes('}') ) {
          let pushThis = array[index - 1].replace(' {', '').trim() + '.' + ele.trim();
          childArr.push(pushThis.trim());
        } else if ( !ele.includes('{') && !ele.includes('}') && ele.trim() != "") childArr.push(ele.trim());
      }
    });
    return childArr;
  }
}

