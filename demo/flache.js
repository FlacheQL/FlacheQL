import ComparisonCache from './queryCache';

export default class Flache {

  constructor(props) {
    this.cache = {};
    this.queryCache = {};
    this.queryCacheLength = 0;
    this.comparisonCache = new ComparisonCache();
    this.cacheExpiration = 1000 * 120;
    this.options = {
      partialRetrieval: false,
      subsets: {}
    },
      // this.contains = (fields, query) => {
      //   console.log('in contains, key: ', query);
      //   console.log('in contains, fields: ', fields);
      //   if (query.match((fields[0] && fields[1]))) {
      //     return ([fields[0], fields[1]]);
      //   } else if (query.match((fields[0]))) {
      //     return (fields[0]);
      //   } else if (query.match((fields[1]))) {
      //     return (fields[1]);
      //   } else return false;
      // },
      this.cleanQuery = (query) => {
        let queryStr = JSON.stringify(query);
        let resultStr = queryStr.replace(/\s+/g, '  ').trim();
        resultStr = resultStr.replace(/\s+/g, ' ').trim();
        resultStr = resultStr.replace(/\\n/g, ' ');
        resultStr = resultStr.replace('/', '');
        resultStr = resultStr.replace(/\\/g, '');
        return resultStr;
      }
  }

  it(query, variables, endpoint, headers = { "Content-Type": "application/graphql" }, options) {
    // create a key to store the O(1) payloads in the cache
    const stringifiedQuery = JSON.stringify(this.cleanQuery(query));
    console.log('variables :', variables)
    // if an identical query comes in return the cached result
    if (this.cache[stringifiedQuery]) {
      return new Promise((resolve, reject) => {
        resolve(this.cache[stringifiedQuery]);
      });
    } else this.cache[stringifiedQuery] = { data: null };
    // here we do the sub-field retrieval
    this.comparisonCache.cacheQuery(this.cleanQuery(stringifiedQuery), this.cache[stringifiedQuery]);

    // set boolean to check for partial queries, else fetch and return
    if (options.partialRetrieval) this.options.partialRetrieval = true;
    else return this.fetchData(query, endpoint, headers, stringifiedQuery);

    // save subsets to state
    if (options.defineSubsets) this.options.subsets = options.defineSubsets;

    // returns an array of callback functions that check query validity using subset options
    const cbs = this.createCallbacksForPartialQueryValidation(this.options.subsets)

    // create a boolean to check if all queries are subsets of others
    let allQueriesPass = false;

    // increment cache length
    this.queryCacheLength++;

    if (this.options.partialRetrieval) {
      // console.log('query cache in partial retrieval ', JSON.parse(JSON.stringify(this.queryCache)))
      let currentMatchedQuery;

      // no need to run partial query check on first query 
      if (this.queryCacheLength > 1) {
        for (let key in variables) {
          // console.log('im the current key:', key)
          for (let query in this.queryCache[key]) {
            //console.log('im the current subset function: ', cbs[this.options.subsets[key]])
            //console.log(`the inputs of the subset function are ${variables[key]} and ${this.queryCache[key][query]}`)
            //console.log('im the result of the current subset function: ', cbs[this.options.subsets[key]](variables[key], this.queryCache[key][query]))
            if (cbs[this.options.subsets[key]](variables[key], this.queryCache[key][query])) {
              // console.log('i'm the current callback function: ', cbs[this.options.subsets[key]])
              currentMatchedQuery = query;
              console.log(`found a match between ${variables[key]} and ${this.queryCache[key][query]}`)
              break;
            }
          }
          if (currentMatchedQuery) {
            console.log('got a match on the first try')
            for (let currentKey in this.queryCache) {
              // skip the first one since this is the one that just matched
              if (key === currentKey) continue;

              /* else run the value on that query on each callback 
              such that if the callback of the current symbol passes
              given the current query variable as the first argument, 
              and the cached value on the current matched query key as the second,
              the queriesPass boolean is set to the return value of the callback */
              let rule = this.options.subsets[currentKey];
              let arg1 = variables[currentKey];
              let arg2 = this.queryCache[currentKey][currentMatchedQuery];
              let result = cbs[rule](arg1, arg2);
              console.log('this is the outcome of the current callback: ', cbs[rule](arg1, arg2))
              // if the result of the callback is truthy, set the boolean to that value
              if (result) allQueriesPass = result;
              else {
                // reset the boolean and break out
                allQueriesPass = false;
                break;
              }

            }
            if (allQueriesPass) {
              return new Promise((resolve, reject) => {
                resolve(this.cache[currentMatchedQuery]);
              })
            }
          } else {
            console.log('dont bother trying')
            break;
          }
        }
      }

      // add variables to query cache or create new properties on query cache if variables do not exist
      Object.keys(variables).forEach(queryVariable => {
        // if a key already exists on the query cache for that variable add a new key value pair to it, else create a new obj 
        if (this.queryCache[queryVariable]) {
          this.queryCache[queryVariable][stringifiedQuery] = variables[queryVariable]
        }
        else this.queryCache[queryVariable] = { [stringifiedQuery]: variables[queryVariable] }
      })

      // if all queries pass and this is not the first query grab from the cache 
      if (allQueriesPass && this.queryCacheLength > 1) {
        // filter items from cache and grab all the ones that match the subset filters
        console.log('GRABBING FROM THE CACHE GRABBING FROM THE CACHEGRABBING FROM THE CACHEGRABBING FROM THE CACHEGRABBING FROM THE CACHE')
      }

      // if query validation fails fetch data
      return this.fetchData(query, endpoint, headers, stringifiedQuery);
    } else {
      // if an identical query comes in return the exact match, else make a call to the server
      if (this.cache[stringifiedQuery]) {
        return new Promise((resolve, reject) => {
          resolve(this.cache[stringifiedQuery]);
        })
      } else {
        return this.fetchData(query, endpoint, headers, stringifiedQuery);
      }
    }
  }

  fetchData(query, endpoint, headers, stringifiedQuery) {
    return new Promise((resolve, reject) => {
      fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          this.cache[stringifiedQuery].data = res.data;
          setTimeout(() => delete this.cache[stringifiedQuery], this.cacheExpiration)
          resolve(res);
          if (this.options.resultsVariable) {
            // ADD PROPERTY ON QUERY IN CACHE TO INDICATE WHETHER NUMBER OF RETURNED RESULTS IS GREATER THAN MAX
          }
        })
        .catch(err => err)
    })
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
            return str1.includes(str2)
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
      return obj
    }, {})
  }
}

