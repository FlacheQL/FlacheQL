import flatten from './flatten'
import createChildren from './constructQueryChildren'

const fetchData = (query, endpoint, headers, stringifiedQuery) => {
    console.log('q', query)
    console.log('e', endpoint)
    console.log('h', headers)
    console.log('s', stringifiedQuery)
    return new Promise((resolve, reject) => {
      fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query
        })
      })
        .then(res => {
          console.log('getting json', res)
          return res.json()
        })
        .then(res => {
          this.cache[stringifiedQuery] = res;
          let normalizedData = flatten(res);
          this.fieldsCache.push({[this.queryParams]: {data: normalizedData, children: createChildren(query)}});
            console.log('THIS IS THE RESPONSE', res)
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

export default fetchData;