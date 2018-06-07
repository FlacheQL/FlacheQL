import { combineReducers } from 'redux';

// import all reducers here
import toolsReducer from './toolsReducer';

// combine reducers
const reducers = combineReducers({
  // if we had other reducers, they would go here
  tools: toolsReducer,
});

// make the combined reducers available for import
export default reducers;

