function findEndOfNestedObject(string) {
  let level = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] === '{') level++;
    if (string[i] === '}') level--;
    if (level === 0) return i;
  }
}

function findEndOfSpreadField(string) {
  for (let i = 0; i < string.length; i++) {
    if (string[i] === '{') return i;
  }
}

function buildQueryCacheObj(string) {
  const returnObj = {};
  let i = 1;
  let item = '';
  while (i < string.length) {
    if (string[i] === '.') {
      returnObj[item] = item;
      const spreadEnd = findEndOfSpreadField(string.slice(i));
      item = string.slice(i, i + spreadEnd - 1);
      i += spreadEnd;
      const newI = findEndOfNestedObject(string.slice(i));
      returnObj[item] = buildQueryCacheObj(string.slice(i, i + newI + 1), 0);
      item = '';
      i += newI + 1;
      continue;
    }
    if (/\w/.test(string[i])) {
      item += string[i];
    } else if (string[i] === '{') {
      const newI = findEndOfNestedObject(string.slice(i));
      returnObj[item] = buildQueryCacheObj(string.slice(i, i + newI + 1), 0);
      item = '';
      i += newI + 1;
      continue;
    } else if (string[i] === ' ' && /\w/.test(string[i + 1])) {
      if (item) returnObj[item] = item; // refactor to assign stuff
      item = '';
    } else if (string[i] === '}') {
      if (item) returnObj[item] = item;
      return returnObj;
    }
    i++;
  }
}

class QueryCache {
  constructor() {
    this.cache = {};
  }
}
function matchObjects(base, comparison) {
  // loop through the keys in comparison
  for (let cKey in comparison) {
    // check that the corresponding key in base exists
    if (!base.hasOwnProperty(cKey)) return false;
    // recurse if nested
    if (typeof comparison[cKey] === 'object') {
      if (!matchObjects(base[cKey], comparison[cKey])) return false;
    }
  }
  // passed!
  return true;
}

QueryCache.prototype.cacheQuery = function cacheQuery(queryStr) {
  // console.log('request to cache a query!');
  const start = queryStr.search(/\w/);
  const end = queryStr.indexOf(')') + 1;
  const paramString = queryStr.slice(start, end);
  const matchedCache = this.cache[paramString];
  const incomingQueryObject = buildQueryCacheObj(queryStr.slice(end + 3));
  if (matchedCache) {
    // look for a subset match
    // loop through the existing cache for this parameter set
    for (let i = 0; i < matchedCache.length; i += 1) {
      if (matchObjects(matchedCache[i], incomingQueryObject)) {
        // spit out the data for the matched object
        return matchedCache[i].payload
        break; // or return
      }
    }
    matchedCache.push(incomingQueryObject);
    // return something? or call another action?
  }
  else this.cache[paramString] = [incomingQueryObject];
}


// const qc = new QueryCache();
// qc.cacheQuery('{  search(query: "graphql language:python stars:>5", type: REPOSITORY, first: 10) {  repositoryCount  edges {  node {  ... on Repository {  name    descriptionHTML  stargazers {  totalCount  }  forks {  totalCount  }  updatedAt  }  }  }  }  }');

// qc.cacheQuery('{  search(query: "graphql language:python stars:>5", type: REPOSITORY, first: 10) {  repositoryCount  edges {  node {  ... on Repository {  name    stargazers {  totalCount  }  forks {  totalCount  }  updatedAt  }  }  }  }  }');

// console.log(matchObjects(qc.cache['search(query: "graphql language:python stars:>5", type: REPOSITORY, first: 10)'][1], qc.cache['search(query: "graphql language:python stars:>5", type: REPOSITORY, first: 10)'][0]));

// export default QueryCache;