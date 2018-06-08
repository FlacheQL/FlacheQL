import React from 'react';

const TweetDisplay = (props) => (
  <div className="singleTweet">
    <div className="set1">
      <h4>Name: {props.allTweets[props.i].tweetName}</h4>
      <h4>Application: {props.allTweets[props.i].tweetApp}</h4>
      <h4>Type: {props.allTweets[props.i].tweetType}</h4>
    </div>
    <div className="set2">
      <h4>Description: {props.allTweets[props.i].tweetDesc}</h4>
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