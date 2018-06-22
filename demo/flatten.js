export default class Flatten {

    it(object, item, stem) {
      // stem is required!, pass it the query to start
      console.log('in flatten');
      let end = {};
      let newStem = (typeof stem !== 'undefined' && stem !== '') ? stem + '_' + item : item;

      if (typeof object !== 'object') {
        end[stem] = object;
        return end;
      }
      
      for (let item in object) {
        console.log('in for-in to flatten');
        let prop = it(object[prop], item, newStem);
        end[newStem] = prop; 
      }
      
      return end;
    }
}
