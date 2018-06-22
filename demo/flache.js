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
    // console.log(query);

    // create a children array to check params --> TROUBLE CREATING CHILDREN!?!
    this.children = this.createChildren(query);
    console.log('query children: ', this.children);

    // if an identical query comes in return the cached result
    if (this.cache[stringifiedQuery]) {
      return new Promise((resolve) => {
        console.log('resolving from cache')
        resolve(this.cache[stringifiedQuery]);
      });
    }
    console.log('dont show up')
    // set boolean to check for partial queries, else fetch and return
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
    
    if (this.options.paramRetrieval) {
        //check if query children match
        let childrenMatch = false;
        // console.log('children:', this.children)
        // console.log('fields cache,', JSON.parse(JSON.stringify(this.fieldsCache)))

        childrenMatch = this.fieldsCache.some(obj => {
            // console.log('children for each thing in cache:', Object.values(obj)[0].children)
            let objChildren = Object.values(obj)[0].children
            return objChildren.every(child => this.children.includes(child)) && this.children.every(child => objChildren.includes(child))
        })

        // console.log('childrenmatch:', childrenMatch)
        // no need to run partial query check on first query
        if (childrenMatch) {
            if (this.cacheLength > 0) {
                let currentMatchedQuery;
                for (let key in variables) {
                    //   console.log('im the current key:', key)
                    for (let query in this.queryCache[key]) {
                        // console.log('im the current subset function: ', this.cbs[this.options.subsets[key]])
                        // console.log(`the inputs of the subset function are ${variables[key]} and ${this.queryCache[key][query]}`)
                        // console.log('im the result of the current subset function: ', this.cbs[this.options.subsets[key]](variables[key], this.queryCache[key][query]))
                        
                        if (this.cbs[this.options.subsets[key]](variables[key], this.queryCache[key][query])) {
                        // if the callback returns true, set the currentMatchedQuery to be the current query
                        currentMatchedQuery = query;
                        } else {
                            continue;
                        }

                        // console.log('checking current matched query: ', currentMatchedQuery)
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
                            //   console.log('rule: ', rule)
                            //   console.log('arg1: ', arg1)
                            //   console.log('arg2: ', arg2)
                            //   console.log('result: ', result)
                            
                            // if the result of the callback is truthy, set the boolean to that value
                            if (result) {
                                allQueriesPass = result;
                            } else {
                                // reset the boolean and break out
                                // console.log('resetting FOOL')
                                allQueriesPass = false;
                                break;
                            }
                        }

                        if (allQueriesPass) {
                            // console.log('went into all queries pass!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                            let pathToNodes = options.pathToNodes;
                            let cached = Object.assign(this.cache[currentMatchedQuery], {});
                            let { path, lastTerm } = this.constructResponsePath(pathToNodes, cached)
            
                            for (let key in options.queryPaths) {
                            path[lastTerm] = path[lastTerm].filter(el => {
                                let { path, lastTerm } = this.constructResponsePath(options.queryPaths[key], el)
                                // return path[lastTerm] > variables[key];
                                return this.cbs[this.options.subsets[key]](path[lastTerm], variables[key])
                            });
                            //   console.log(cached);
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
        console.log('in field retrieval');
        let filtered;
        let foundMatch = false;
        // console.log('query children: ', children);
        //console.log('fieldsCache: ', this.fieldsCache, 'before queriesArr built');
        //let queriesArray = Object.values(this.fieldsCache);
        // console.log('query array: ', this.fieldsCache);
        this.fieldsCache.forEach((node) => {
            console.log('im a node:', node)
            console.log('im the query params,:', this.queryParams)
            console.log('node has prop', node.hasOwnProperty(this.queryParams))
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
                console.log('resolving in retrieve');
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

    console.log('go fetch fool')
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
          //   console.log('fields cache in fetch: ', JSON.parse(JSON.stringify(this.fieldsCache)));
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
    // console.log(childArr)
    return childArr;
  }


}
