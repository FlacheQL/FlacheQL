const Flatten = (object) => {
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

export default Flatten;
