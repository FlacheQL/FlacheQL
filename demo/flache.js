//const flatten = require('./flatten');
const _ = require('lodash');
const diff = require('deep-diff');

export default class Flache {
    constructor(props) {
        this.cache = {};
        this.cacheMap;
        this.queryCache = {};
        this.cacheExpiration = 1000 * 120;
    }

    it(query, variables, endpoint, headers = { "Content-Type": "application/graphql" }) {
        const key = JSON.stringify(query);
        Object.keys(variables).forEach(variable => {
            if (this.queryCache[variable]) {
                this.queryCache[variable][variables[variable]] = variables[variable]
            }
            else this.queryCache[variable] = { [variables[variable]]: variables[variable] }
        });
          
        // parse and clean the newline chars, extra spaces, and slashes from the query
        const cleanQuery = (query) => {
          let queryStr = JSON.stringify(query);
          let resultStr = queryStr.replace(/\s+/g, '  ').trim();
          resultStr = resultStr.replace(/\s+/g, ' ').trim();
          resultStr = resultStr.replace(/\\n/g, ' ');
          resultStr = resultStr.replace('/', '');
          resultStr = resultStr.replace(/\\/g, '');
          return resultStr;
        };
        // scrub the query that was just issued
        let compKey = cleanQuery(query);
        // execute the diffing from the 'deep-diff' package that's imported above. 
        let changes = diff(compKey, this.cache);
        console.log('test diff func: ', changes);

        if (this.cache[key]) {
            return new Promise((resolve, reject) => {
                console.log('cached item: ', this.cache[key]);
                resolve(this.cache[key]);
            })
        } else {
            return new Promise((resolve, reject) => {
                console.log('about to fetch');
                fetch(endpoint, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        query,
                    }),
                })
                .then((res) => res.json())
                .then((res) => {
                    console.log('about to resolve promise');
                    this.cache[key] = res;
                    //this.cacheMap = flatten.it(this.cache, repositories, query);
                    setTimeout(() => delete this.cache[key], this.cacheExpiration);
                    //console.log(this.cache);
                    // create a map and flatten the cached item
                    //this.cacheMap = new Map(Object.entries(this.cache));
                    //console.log('normal cache: ', this.cache);
                    //console.log('mapped cache: ', this.cacheMap);
                    resolve(res);
                })
                .catch(err => err)
            })
        }
    }
}

