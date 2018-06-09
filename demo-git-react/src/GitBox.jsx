import React, { Component } from "react";

class GitBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="gitbox">
        <div className="gitbox-static-data">
          <span>{this.props.author}</span>
          <span>{this.props.title}</span>
          <span>{this.props.isbn}</span>
        </div>
        <div className="gitbox2">
        </div>
      </div>
    )
  }
};

export default GitBox;