import * as types from '../constants/actionTypes';

const initialState = {
  allTweets: [
    {
      tweetText: "This is a long tweet about things that are very interesting", 
      tweetComments: ['i love long interesting things', 'me too', 'yay'],
      tweetLikes: 0
    },
    {
      tweetText: "This is a short little tweet", 
      tweetComments: "comments",
      tweetLikes: 0
    },
    {
      tweetText: "Sweet baby juuls ruul", 
      tweetComments: "comments",
      tweetLikes: 0
    },
  ],
};


const tweetsReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'ADD_TWEET':
      console.log('adding tweet')
      let newState = JSON.parse(JSON.stringify(state));
      let newTweet = {
        tweetText: action.tweetText,
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