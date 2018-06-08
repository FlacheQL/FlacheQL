import * as types from '../constants/actionTypes';

const initialState = {
  allTweets: [
    {
      tweetName: "npm install with -D flag", 
      tweetApp: "Terminal", 
      tweetType: "NPM Shortcut", 
      tweetDesc: "saves whatever you install to the dev dependencies (same thing as doing '--save-dev')",
      tweetLikes: 0
    },
    {
      tweetName: "Duplicate Lines Up and Down", 
      tweetApp: "VS Code", 
      tweetType: "Keyboard Shortcut", 
      tweetDesc: "Shift + Option + Down Arrow / Shift + Option + Down Arrow. Without highlighting anything you can duplicate a line. You can also drag your mouse haphazardly over a bunch of lines and with the same shortcut it will copy down the entire lines",
      tweetLikes: 0
    },
    {
      tweetName: "Color Zilla", 
      tweetApp: "Chrome", 
      tweetType: "Extension", 
      tweetDesc: "Gives you a pointer so you can click anywhere on a webpage and it will give you the both the rgb and hex codes for that color",
      tweetLikes: 0
    },
  ],
};


const tweetsReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'ADD_TOOL':
      console.log('adding tweet')
      let newState = JSON.parse(JSON.stringify(state));
      let newTweet = {
        tweetName: action.tweetName,
        tweetApp: action.tweetApp,
        tweetType: action.tweetType,
        tweetDesc: action.tweetDesc,
        tweetLikes: action.tweetLikes
      }
      newState.allTweets = newState.allTweets.slice();
      newState.allTweets.push(newTweet)
      return newState;
    case 'ADD_LIKE': 
      let addState = JSON.parse(JSON.stringify(state));
      addState.tweetLikes++;
      addState.allTweets[action.index].tweetLikes++;
      addState.allTweets.sort((a, b) => {return b.tweetLikes - a.tweetLikes});
      return addState;
      case 'DELETE_LIKE':
      let delState = JSON.parse(JSON.stringify(state));
      delState.tweetLikes--;
      delState.allTweets[action.index].tweetLikes--;
      delState.allTweets.sort((a, b) => {return b.tweetLikes - a.tweetLikes});
      return delState;
    default:
      return state;
  }
};

export default tweetsReducer;







    // case 'ADD_CARD': 
    //   let addState = JSON.parse(JSON.stringify(state));
    //   addState.totalCards++;
    //   addState.tweetList[action.index].cards++;
    //   addState.tweetList.map(el => {
    //     el.percentTotal = ((el.cards / addState.totalCards) * 100).toFixed(2);
    //     return el;
    //   })
    //   return addState;
    //   case 'DELETE_CARD':
    //   let delState = JSON.parse(JSON.stringify(state));
    //   delState.totalCards--;
    //   delState.tweetList[action.index].cards--;
    //   delState.tweetList.map(el => {
    //     el.percentTotal = ((el.cards / delState.totalCards) * 100).toFixed(2);
    //     return el;
    //   })
    //   return delState;