import React, { Component } from "react";

class QueryTimer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="timer-wrapper">
        <div id="timer">
          <center><h3>Query Timer</h3></center>
          <div id="timer-text">{this.props.timerText}</div>
          <div id="clock"><center>{this.props.lastQueryTime}</center></div>
        </div>
      </div>
    )
  }
};

export default QueryTimer;