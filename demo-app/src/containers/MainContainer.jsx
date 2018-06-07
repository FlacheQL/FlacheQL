import React, { Component } from 'react';
import { connect } from 'react-redux';
import ToolsDisplay from '../components/ToolsDisplay.jsx';
import ToolCreatorContainer from './ToolCreatorContainer.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import * as actions from '../actions/actions';

// import from child components...

//take date from store, sends to props
const mapStateToProps = store => ({
  // add pertinent state here...totalTools, total cards
    allTools: store.tools.allTools
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
          <ToolCreatorContainer />
          <div className="extraOuter">
            <h1 id="header">Most Beloved Tools</h1>
          </div>
        <div className="outerBox">
              <ToolsDisplay allTools={this.props.allTools} onAddLike={this.props.onAddLike} onDeleteLike={this.props.onDeleteLike}/>
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
