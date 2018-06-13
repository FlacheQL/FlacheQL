import React, { Component } from "react";

class QueryTimer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id={`${this.props.title}-timer`} className={this.props.class}>
        <center><h3>{this.props.title} Timer</h3></center>
        <div className="timer-text">{this.props.timerText}</div>
        <div className="clock"><center>{this.props.lastQueryTime}</center></div>
      </div>
    )
  }
};

export default QueryTimer;