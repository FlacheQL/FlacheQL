const Fetch = (query, endpoint, headers, stringifiedQuery) => {
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

export default Fetch;