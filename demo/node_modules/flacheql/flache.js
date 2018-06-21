export default class Flache {
    constructor(props) {
        this.cache = {};
        this.cacheExpiration = 1000 * 120;
    }

    it(query, endpoint, headers) {
        let key = JSON.stringify(query);
        if (this.cache[key]) {
            return this.cache[key];
        }
        else {
            return fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query,
                }),
            })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                this.cache[key] = res;
                setTimeout(() => delete this.cache[key], this.cacheExpiration)
                return res
            })
        }
      

    }

}

