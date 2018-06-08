import { combineReducers } from 'redux';

// import all reducers here
import tweetsReducer from './tweetsReducer';

// combine reducers
const reducers = combineReducers({
  // if we had other reducers, they would go here
  tweets: tweetsReducer,
});

// make the combined reducers available for import
export default reducers;

