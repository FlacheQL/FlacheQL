/**
 * ************************************
 *
 * @module  toolsDisplay
 * @author
 * @date
 * @description presentation component that renders n MarketDisplay components
 *
 * ************************************
 */

import React from 'react';
import ToolDisplay from './ToolDisplay.jsx';


const ToolsDisplay = (props) => {
  return(
    <div className="displayBox">
        {
          props.allTools
          .map((el, i) => {
            return <div id={i} key={i}><ToolDisplay {...props} onAddLike={props.onAddLike} onDeleteLike={props.onDeleteLike} key={i} i={i} /></div>})
        }
    </div>
  );
};

export default ToolsDisplay;

// const PhotoGrid = React.createClass({
//   render() {
//     return (
//       <div className="photo-grid">
//         {this.props.posts.map((post, i) => <Photo {...this.props} key={i} i={i} post={post} />)}
//       </div>
//     )
//   }
// });
