export default class Flache {
    constructor(props) {
        this.cache = {};
        this.cacheExpiration = 1000 * 120;
    }

    it(query, endpoint, headers = { "Content-Type": "application/graphql" }) {
        let key = JSON.stringify(query);
        if (this.cache[key]) {
            return new Promise((resolve, reject) => {
                resolve(this.cache[key]);
            })
        }
        else {
            return new Promise((resolve, reject) => {
                let response = fetch(endpoint, {
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
            })
        }
      

    }

}

