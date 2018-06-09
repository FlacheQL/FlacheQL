import React, { Component } from "react";

class GitBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="gitbox">
        <div className="gitbox-static-data">
          <span>{this.props.name}</span>
          <span>{this.props.stars}</span>
          <span>{this.props.forks}</span>
        </div>
        <div className="gitbox2">
        </div>
      </div>
    )
  }
};

export default GitBox;