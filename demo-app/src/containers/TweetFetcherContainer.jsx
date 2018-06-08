import React, { Component } from 'react';
import { connect } from 'react-redux';
// import actions from action creators file
import * as actions from '../actions/actions';
import TweetFetcher from '../components/TweetFetcher.jsx'
import TweetsDisplay from '../components/TweetsDisplay.jsx'

// import child components...

const mapStateToProps = store => {
  // provide pertinent state here
  return {}
};

const mapDispatchToProps = dispatch => {
  return {
    onAddTweet: (tweetName, tweetApp, tweetType, tweetDesc) => {
      dispatch(actions.addTweet(tweetName, tweetApp, tweetType, tweetDesc))
    }
  }
};

class TweetFetcherContainer extends Component {
  render() {
    return(
      <div className="tweet-creator-container">
        <TweetFetcher onAddTweet={this.props.onAddTweet} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TweetFetcherContainer);
