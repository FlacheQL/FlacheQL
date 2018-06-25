const constructResponsePath = (pathString, object) => {
  let terms = pathString.split(".");
  let lastTerm = terms.pop();
  let path = terms.reduce((acc, next) => {
    return acc[next];
  }, object);
  return { path, lastTerm }
}

export default constructResponsePath;