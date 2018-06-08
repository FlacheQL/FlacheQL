/**
 * ************************************
 *
 * @module  TweetsDisplay
 * @author
 * @date
 * @description presentation component that renders n MarketDisplay components
 *
 * ************************************
 */

import React from 'react';
import TweetDisplay from './TweetDisplay.jsx';


const TweetsDisplay = (props) => {
  return(
    <div className="displayBox">
        {
          props.allTweets
          .map((el, i) => {
            return <div id={i} key={i}><TweetDisplay {...props} onAddLike={props.onAddLike} onDeleteLike={props.onDeleteLike} key={i} i={i} /></div>})
        }
    </div>
  );
};

export default TweetsDisplay;

// const PhotoGrid = React.createClass({
//   render() {
//     return (
//       <div className="photo-grid">
//         {this.props.posts.map((post, i) => <Photo {...this.props} key={i} i={i} post={post} />)}
//       </div>
//     )
//   }
// });
