export default class Flache {

    constructor(props) {
        this.cache = {};
        this.queryCache = {};
        this.queryCacheLength = 0;
        this.cacheExpiration = 1000 * 120;
        this.options = {
            partialRetrieval: false,
            defineSubsets: {}
        }
    }

    it(query, variables, endpoint, headers = { "Content-Type": "application/graphql" }, options) {
        console.log('IM A BIG OLD querycache:', this.queryCache)
        console.log('STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY STARTING NEW QUERY ')
        // console.log(variables)
        //create a key to store the payloads in the cache
        const stringifiedQuery = JSON.stringify(query);
        
        if (options.partialRetrieval) this.options.partialRetrieval = true;
        // if (options.defineSubsets) this.options.defineSubsets = options.defineSubsets;
        // console.log(this.options.defineSubsets)
        const test = Object.assign({}, this.queryCache);
        console.log('IM ANOTHER querycache:', test)
        console.log(1)

        this.queryCacheLength++;

        if (this.options.partialRetrieval) {
            let allQueriesPass = true;    
            console.log('current querycache:', this.queryCache, allQueriesPass)
            Object.keys(variables).forEach(variable => {
                console.log('foreach variable:', variable)
                for (let key in this.queryCache[variable]) {
                    console.log('forkeying key:', key, allQueriesPass)
                    if (this.queryCache[variable][key] === variables[variable]) {
                        console.log('POTENTIAL MATCH: querycache and variables', this.queryCache[variable][key], variables[variable])
                        for (let prop in this.queryCache) {
                            if (this.options.defineSubsets[prop] === '=') {
                                console.log('checking equality:', this.queryCache[prop][key], allQueriesPass)
                                if (this.queryCache[prop][key] !== variables[variable]) {
                                    console.log('IN INEQUALITY variables[variable]:', variables[variable])
                                    allQueriesPass = false;
                                }
                            }
                            if (this.options.defineSubsets[prop] === '> number') {
                                console.log('checking num', allQueriesPass)
                                console.log('checking num:', this.queryCache[prop][key], allQueriesPass)
                                if (this.queryCache[prop][key] > variables[variable]) {
                                    allQueriesPass = false;
                                } 
                            }
                            if (this.options.defineSubsets[prop] === '> string') {
                                console.log('prop', this.queryCache[prop], allQueriesPass)
                                console.log('key', key, allQueriesPass)
                                if (this.queryCache[prop][key].includes(variables[variable])) {
                                    allQueriesPass = false;
                                } 
                                
                            }
                        }
                    }
                }
            });

            // add variables to query cache or create new properties on query cache if variables do not exist
            console.log(2)
            Object.keys(variables).forEach(varKey => {
                console.log('STORING FUCKING STUFF to query cache', varKey)
                console.log('STORING FUCKING STUFF to query cache', stringifiedQuery)
                console.log(3)
                if (this.queryCache[varKey]) {
                    this.queryCache[varKey][stringifiedQuery] = variables[varKey]
                }
                else this.queryCache[varKey] = { [stringifiedQuery]: variables[varKey] }
            }) 

            
            console.log('thinking about going to the cache,', allQueriesPass, allQueriesPass, allQueriesPass, allQueriesPass, allQueriesPass, allQueriesPass, allQueriesPass, allQueriesPass, allQueriesPass, allQueriesPass, allQueriesPass, allQueriesPass, allQueriesPass, allQueriesPass)
            console.log('thinking about going to the cache,', this.queryCacheLength, this.queryCacheLength, this.queryCacheLength, this.queryCacheLength, this.queryCacheLength, this.queryCacheLength, this.queryCacheLength, this.queryCacheLength, this.queryCacheLength, this.queryCacheLength, this.queryCacheLength, this.queryCacheLength, this.queryCacheLength, this.queryCacheLength)
            if (allQueriesPass && this.queryCacheLength > 1) {
                // filter items from cache and grab all the ones that match the subset filters
                console.log('GRABBING FROM THE CACHE GRABBING FROM THE CACHEGRABBING FROM THE CACHEGRABBING FROM THE CACHEGRABBING FROM THE CACHE')
            }

            


            if (false) {
                console.log('query cache: ', this.queryCache)
                console.log('variables: ', variables)
            } else {
                return this.fetchData(query, endpoint, headers, stringifiedQuery);
            }
        } else {
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
                this.cache[stringifiedQuery] = res;
                setTimeout(() => delete this.cache[stringifiedQuery], this.cacheExpiration)
                resolve(res);
                console.log(res)
                if (this.options.resultsVariable) {
                    // ADD PROPERTY ON QUERY IN CACHE TO INDICATE WHETHER NUMBER OF RETURNED RESULTS 
                }
            })
            .catch(err => err)
        })
    }
}

