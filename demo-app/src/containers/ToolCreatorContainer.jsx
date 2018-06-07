import React, { Component } from 'react';
import { connect } from 'react-redux';
// import actions from action creators file
import * as actions from '../actions/actions';
import ToolCreator from '../components/ToolCreator.jsx'
import ToolsDisplay from '../components/ToolsDisplay.jsx'

// import child components...

const mapStateToProps = store => {
  // provide pertinent state here
  return {}
};

const mapDispatchToProps = dispatch => {
  return {
    onAddTool: (toolName, toolApp, toolType, toolDesc) => {
      dispatch(actions.addTool(toolName, toolApp, toolType, toolDesc))
    }
  }
};

class ToolCreatorContainer extends Component {
  render() {
    return(
      <div className="tool-creator-container">
        <ToolCreator onAddTool={this.props.onAddTool} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolCreatorContainer);
