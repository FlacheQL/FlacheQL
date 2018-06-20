const deepClone = require('fast-clone');


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

function diveForPropsObj(obj, props) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        return diveForProps(obj[key])
      }
      else if (props.includes(key)) return obj;
    }
  }
}

/**
 * @param {object} payload The raw response data from the matched (superset) query.
 * @param {object} queryObj The broken-down query-like object for which we're looking to retrieve data
 * @returns {object} A response-like object that should satisfy the query
 */

function getSubsetData(payload, queryObj) {
  console.log('getSubsetData: "data" = ', payload);
  console.log('getSubsetData: "queryObj" = ', queryObj);
  const newPayload = {};
  function traverseForSubsetData(payload, queryObj) {
    const newObj = {};
    for (let key in payload) {
      // delete if not in queryObj
      if (queryObj.hasOwnProperty(key)) {
        if (Array.isArray(payload[key])) {
          const props = [];
          for (let hackNodeKey in payload[key][0]) {
            for (let hackProp in payload[key][0][hackNodeKey]) {
              props.push(hackProp);
              console.log('HACKIN THESE PROPS BRO: ', props);
            }
            const 
            payload
            break;

          }
          
        } else newObj[key] = payload[key];
    }
  }
}

QueryCache.prototype.cacheQuery = function cacheQuery(queryStr, payload) {
  const start = queryStr.search(/\w/);
  const end = queryStr.indexOf(')');
  const paramString = queryStr.slice(start, end + 1);
  const primaryKey = queryStr.slice(start, queryStr.indexOf('('));
  const matchedCache = this.cache[paramString];
  const incomingQueryObject = { query: buildQueryCacheObj(queryStr.slice(end + 3)), payload };
  if (matchedCache) {
    // look for a subset match
    // loop through the existing cache for this parameter set
    for (let i = 0; i < matchedCache.length; i += 1) {
      if (matchObjects(matchedCache[i].query, incomingQueryObject.query)) {
        console.log('found subset match!');
        // spit out the data for the matched object
        // parse the data ...and return it?
        return getSubsetData(matchedCache[i].payload.data[primaryKey], incomingQueryObject.query);
      }
    }
    matchedCache.push(incomingQueryObject);
    // if there was no match, return null
    return null;
  }
  // if there was no cached array for that query, make one
  this.cache[paramString] = [incomingQueryObject];
  return null;
}


// const qc = new QueryCache();
// qc.cacheQuery('{  search(query: "graphql language:python stars:>5", type: REPOSITORY, first: 10) {  repositoryCount  edges {  node {  ... on Repository {  name    descriptionHTML  stargazers {  totalCount  }  forks {  totalCount  }  updatedAt  }  }  }  }  }');

// qc.cacheQuery('{  search(query: "graphql language:python stars:>5", type: REPOSITORY, first: 10) {  repositoryCount  edges {  node {  ... on Repository {  name    stargazers {  totalCount  }  forks {  totalCount  }  updatedAt  }  }  }  }  }');

// console.log(matchObjects(qc.cache['search(query: "graphql language:python stars:>5", type: REPOSITORY, first: 10)'][1], qc.cache['search(query: "graphql language:python stars:>5", type: REPOSITORY, first: 10)'][0]));

export default QueryCache;