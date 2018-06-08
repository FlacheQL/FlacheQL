import React from 'react';

const TweetDisplay = (props) => (
  <div className="singleTweet">
    <div className="set1">
      <h4>{props.allTweets[props.i].tweetText}</h4>
      {/* <h4>Application: {props.allTweets[props.i].tweetApp}</h4> */}
      {/* <h4>Type: {props.allTweets[props.i].tweetType}</h4> */}
    </div>
    <div className="set2">
      <h4>Comments: {props.allTweets[props.i].tweetComments}</h4>
    </div>
    <div className="set3">
      <div className="voteButtons">
        <h3>{props.allTweets[props.i].tweetLikes}</h3>
        <button onClick={() => {console.log(`hello: ${props.i}`); {props.onAddLike(props.i)}}}>+</button>
        <button onClick={() => {props.onDeleteLike(props.i)}}>-</button>
      </div>
    </div>
  </div>
);

export default TweetDisplay;