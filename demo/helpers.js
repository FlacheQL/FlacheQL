export function CleanQuery(query) {
  let queryStr = JSON.stringify(query);
    let resultStr = queryStr.replace(/\s+/g, '  ').trim();
    resultStr = resultStr.replace(/\s+/g, ' ').trim();
    resultStr = resultStr.replace(/\\n/g, ' ');
    resultStr = resultStr.replace('/', '');
    resultStr = resultStr.replace(/\\/g, '');
    resultStr = resultStr.match(/\(.*\)/)[0];
    return resultStr;
}

export function ConstructQueryChildren(query) {
  let childArr = [];
  let splitQ = query.split('\n');
  splitQ.forEach((ele, index, array) => {
    if (index > 1) {
      if ( array[index - 1].includes('{') && array[index + 1].includes('}') ) {
        let pushThis = array[index - 1].replace(' {', '').trim() + '.' + ele.trim();
        childArr.push(pushThis.trim());
      } else if ( !ele.includes('{') && !ele.includes('}') && ele.trim() != "") childArr.push(ele.trim());
    }
  });
  return childArr;
}

export function CreateCallbacksForPartialQueryValidation(subsets) {
  return Object.values(subsets).reduce((obj, subsetRule) => {
    let func;
    switch (subsetRule) {
      case "=":
        func = (str1, str2) => {
          return str1 == str2;
        };
        break;
      case "> string":
        func = (str1, str2) => {
          return str1.includes(str2);
        };
        break;
      case ">= number":
        func = (num1, num2) => {
          return num1 >= num2;
        };
        break;
      case "<= number":
        func = (num1, num2) => {
          return num1 <= num2;
        };
        break;
    }
    obj[subsetRule] = func;
    return obj;
  }, {});
}

/**
 * Turns a normalized cache object into an acceptable payload
 * @param {object} pathsObject A normalized object with keys that are the paths to the location of data in the object to be constructed
 * @returns {object} A response-like object that should satisfy a GraphQL query
 */

export default function Denormalize(pathsObject) {
  const payload = {};
  for (let key in pathsObject) {
    let workingObj = payload;
    let path = key.split('.');
    for (let i = 1; i < path.length; i += 1) {
      const e = path[i];
      if (i === path.length - 1) workingObj[e] = pathsObject[key];
      if (!workingObj[e]) {
        // if the item following this one in path array is a number, this nested object must be an array
        if (Number(path[i + 1]) || Number(path[i + 1]) === 0) {
          workingObj[e] = [];
        }
        else workingObj[e] = {};
      }
      workingObj = workingObj[e];
    }
  }
  return payload;
}

export function Fetch(query, endpoint, headers, stringifiedQuery) {
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

export function Flatten(object) {
  return Object.assign( {}, ...function _flatten( objectBit, path = '') {
    return [].concat(
      ...Object.keys( objectBit ).map(
        key => {
            return typeof objectBit[key] === 'object' ?
         _flatten( objectBit[key], `${path}.${key}`) : 
        ( { [`${ path }.${ key }` ]: objectBit[key]});
        }
      )
    )
  }(object));
}

