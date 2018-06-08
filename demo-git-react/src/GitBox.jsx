import React, { Component } from "react";

class GitBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="gitbox">
        <div className="gitbox-static-data">
          <span>Repo name</span>
          <span>Repo owner</span>
          <span>Date created</span>
        </div>
        <div className="gitbox2">
        </div>
      </div>
    )
  }
};

export default GitBox;