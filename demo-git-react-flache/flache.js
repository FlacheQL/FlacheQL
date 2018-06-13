export default class Flache {
    constructor(props) {
        this.cache = {};
        this.queryCache = {};
        this.cacheExpiration = 1000 * 120;
    }

    it(query, variables, endpoint, headers = { "Content-Type": "application/graphql" }) {
        const key = JSON.stringify(query);
        Object.keys(variables).forEach(variable => {
            if (this.queryCache[variable]) {
                this.queryCache[variable][variables[variable]] = variables[variable]
            }
            else this.queryCache[variable] = { [variables[variable]] : variables[variable] }
        }) 
        console.log('query cache:', this.queryCache)
        
        if (this.cache[key]) {
            return new Promise((resolve, reject) => {
                resolve(this.cache[key]);
            })
        } else {
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
                    this.cache[key] = res;
                    setTimeout(() => delete this.cache[key], this.cacheExpiration)
                    resolve(res);
                })
                .catch(err => err)
            })
        }
    }

}

