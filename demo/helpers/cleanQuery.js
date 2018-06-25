const cleanQuery = (query) => {
  let queryStr = JSON.stringify(query);
    let resultStr = queryStr.replace(/\s+/g, '  ').trim();
    resultStr = resultStr.replace(/\s+/g, ' ').trim();
    resultStr = resultStr.replace(/\\n/g, ' ');
    resultStr = resultStr.replace('/', '');
    resultStr = resultStr.replace(/\\/g, '');
    resultStr = resultStr.match(/\(.*\)/)[0];
    return resultStr;
}

export default cleanQuery;