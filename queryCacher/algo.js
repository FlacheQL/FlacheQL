function findEndOfNestedObject(string) {
  let level = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] === '{') level++;
    if (string[i] === '}') level--;
    if (level === 0) return i;
  }
}


function buildQueryCacheObj(string) {
  const returnObj = {};
  let i = 1;
  let item = '';
  let dotDotDot = false;
  while (i < string.length) {
    if (item === '...') dotDotDot = true;
    if (/\w/.test(string[i])) { // must refactor for "..."
      item += string[i];
    } else if (string[i] === '{') {
      const newI = findEndOfNestedObject(string.slice(i));
      returnObj[item] = buildQueryCacheObj(string.slice(i, i + newI + 1), 0);
      item = '';
      dotDotDot = false;
      i += newI + 1;
      continue;
    } else if (!dotDotDot && string[i] === ' ' && /\w/.test(string[i + 1])) {
      if (item) returnObj[item] = item; // refactor?
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
    this.queryCache = {};
  }
}

QueryCache.prototype.cacheQuery = function cacheQuery(queryStr) {
  const start = queryStr.search(/\w/);
  const end = queryStr.indexOf(')');
  this.queryCache[queryStr.slice(start, end)] = buildQueryCacheObj(queryStr.slice(end + 3));
}

const str = `{ search(query: "flache", type: REPOSITORY, first: 10) { repositoryCount ... on Repository { forks stargazers { totalCount } owner { name id friends { name } } forkCount } } }`;

const qc = new QueryCache();
qc.cacheQuery(str);

console.log(qc.cache);