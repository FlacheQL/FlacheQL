const flatten = (object) => {
  return Object.assign( {}, ...function flattener( objectBit, path = '') {
    return [].concat(
      ...Object.keys( objectBit ).map(
        key => {
          return typeof objectBit[key] === 'object' && objectBit[key] !== null ?
          flattener( objectBit[key], `${path}.${key}`) : 
          ( { [`${ path }.${ key }` ]: objectBit[key]});
        }
      )
    )
  }(object));
}

export default flatten;
