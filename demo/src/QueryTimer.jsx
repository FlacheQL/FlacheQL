import React, { Component } from "react";

class QueryTimer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let calcQueryTime = (string) => string.slice(0, string.indexOf(".") + 2) + " ms";

    return (
      <div className={this.props.class}>
        <center><h3>{this.props.title} Timer</h3></center>
        <div className="timer-text">{this.props.timerText}</div>
        <div className="clock"><center>{calcQueryTime(this.props.lastQueryTime)}</center></div>
      </div>
    )
  }
};

export default QueryTimer;