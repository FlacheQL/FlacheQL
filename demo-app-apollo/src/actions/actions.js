// import actionType constants
import * as types from '../constants/actionTypes'

export const addTweet = (tweetName, tweetApp, tweetType, tweetDesc) => ({
  type: 'ADD_TOOL',
  tweetName, 
  tweetApp, 
  tweetType, 
  tweetDesc,
  tweetLikes: 0
});

export const addLike = (index) => ({
  type: 'ADD_LIKE',
  index
});

export const deleteLike = (index) => ({
  type: 'DELETE_LIKE',
  index
});

// // add more action creators

// export const addMarket = (location, cards, percentTotal) => ({
//   type: 'ADD_MARKET',
//   location,
//   cards,
//   percentTotal
// });


// export function increment(index) {
//   return {
//       type: 'INCREMENT_LIKES',
//       index
//   }
// }
// // add comment
// export function addComment(postId, author, comment) {
//   return {
//       type: 'ADD_COMMENT',
//       postId,
//       author,
//       comment
//   }
// }

// // remove comment
// export function removeComment(postId, i) {
//   return {
//       type: 'REMOVE_COMMENT',
//       i,
//       postId
//   }
// }