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

QueryCache.prototype.cacheQuery = function cacheQuery(queryStr) {
  console.log('request to cache a query!');
  const start = queryStr.search(/\w/);
  const end = queryStr.indexOf(')');
  const paramString = queryStr.slice(start, end);
  if (this.cache[paramString]) this.cache[paramString].push(buildQueryCacheObj(queryStr.slice(end + 3)));
  else this.cache[paramString] = [buildQueryCacheObj(queryStr.slice(end + 3))];
}

// const qc = new QueryCache();
// qc.cacheQuery('')

export default QueryCache;