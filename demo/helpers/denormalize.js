/**
 * Turns a normalized cache object into an acceptable payload
 * @param {object} pathsObject A normalized object with keys that are the paths to the location of data in the object to be constructed
 * @returns {object} A response-like object that should satisfy a GraphQL query
 */

const Denormalize = (pathsObject) => {
  const payload = {};
  for (let key in pathsObject) {
    let workingObj = payload;
    let path = key.split('.');
    for (let i = 1; i < path.length; i += 1) {
      const e = path[i];
      // if we're at the end of the array, we can do the value assignment! yay!!
      if (i === path.length - 1) workingObj[e] = pathsObject[key];
      // only construct a sub-object if one doesn't exist with that name yet
      if (!workingObj[e]) {
        // if the item following this one in path array is a number, this nested object must be an array
        if (Number(path[i + 1]) || Number(path[i + 1]) === 0) {
          workingObj[e] = [];
        }
        else workingObj[e] = {};
      }
      // dive further into the object
      workingObj = workingObj[e];
    }
  }
  return payload;
}

export default Denormalize;