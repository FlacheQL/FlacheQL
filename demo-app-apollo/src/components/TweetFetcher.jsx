import React from 'react';

const TweetFetcher = props => (
    <div> 
      <h4> Add a Workflow Tweet </h4>
        <label>NAME:  <input id="tweetName" type="text"/></label>
        <label>APPLICATION:  <input id="tweetApp" type="text"/></label>
        <label>TYPE:  <input id="tweetType" type="text"/></label>
        <label className="descL" >DESCRIPTION:  <input className="tweetD" id="tweetDesc" type="text"/></label>
        <button onClick={() => {
            // let tweetName = document.getElementById("tweetName").value;
            // let tweetApp = document.getElementById("tweetApp").value;
            // let tweetType = document.getElementById("tweetType").value;
            // let tweetDescription = document.getElementById("tweetDescription").value;
            console.log(tweetName.value)
            props.onAddTweet(tweetName.value, tweetApp.value, tweetType.value, tweetDesc.value);
            }}>Add New Tweet
        </button>
    </div>
  );
  
  export default TweetFetcher;
  