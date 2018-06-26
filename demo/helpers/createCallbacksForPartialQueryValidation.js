const createCallbacksForPartialQueryValidation = (subsets) => {
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
      case "limit":
        func = (num1, num2) => {
          return num1 <= num2;
        };
        break;
    }
    obj[subsetRule] = func;
    return obj;
  }, {});
}

export default createCallbacksForPartialQueryValidation;