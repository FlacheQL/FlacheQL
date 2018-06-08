import React, { Component } from 'react';
import { connect } from 'react-redux';
import TweetsDisplay from '../components/TweetsDisplay.jsx';
import FavTweetsDisplay from '../components/TweetsDisplay.jsx';
import TweetFetcherContainer from './TweetFetcherContainer.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import * as actions from '../actions/actions';

// import from child components...

//take date from store, sends to props
const mapStateToProps = store => ({
  // add pertinent state here...totalTweets, total cards
    allTweets: store.tweets.allTweets
});
//these are the functions, actions refer to here
const mapDispatchToProps = dispatch => {
  return {
    onAddLike: (index) => {
      dispatch(actions.addLike(index))
    },
    onDeleteLike: (index) => {
      dispatch(actions.deleteLike(index))
    }
  }
};

class MainContainer extends Component {
  render() {
    return(
      <div className="container">
        <Header />
          <TweetFetcherContainer />
          <div className="header">
            <h1 id="header">Most Beloved Tweets</h1>
          </div>
        <div className="extraOuter">
          <div className="outerBox">
                <TweetsDisplay allTweets={this.props.allTweets} onAddLike={this.props.onAddLike} onDeleteLike={this.props.onDeleteLike}/>
          </div>
          <div className="outerBox">
                <FavTweetsDisplay allTweets={this.props.allTweets} onAddLike={this.props.onAddLike} onDeleteLike={this.props.onDeleteLike}/>
          </div>
        </div>
          <Footer />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);


// const PhotoGrid = React.createClass({
//   render() {
//     return (
//       <div className="photo-grid">
//         {this.props.posts.map((post, i) => <Photo {...this.props} key={i} i={i} post={post} />)}
//       </div>
//     )
//   }
// });
