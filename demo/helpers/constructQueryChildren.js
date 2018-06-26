const constructQueryChildren = (query) => {
  query = JSON.stringify(query);
  let childArr = [];
  let splitQ = query.split('\\n');
  splitQ.forEach((ele, index, array) => {
    if (index > 1) {
      if (array[index - 1].includes('{') && array[index + 1].includes('}') ) {
        let pushThis = array[index - 1].replace(' {', '').trim() + '.' + ele.trim();
        childArr.push(pushThis.trim());
      } else if (!ele.includes('{') && !ele.includes('}') && ele.trim() != "") childArr.push(ele.trim());
    }
  });
  return childArr;
}

export default constructQueryChildren;