import React, { Component } from "react";

class CacheNotifier extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const currentClass = this.props.showCacheHit ? "cache-notifier" : "cache-notifier hidden";
    return (
      <div className={currentClass}>
        <center><h2>CACHE WAS HIT!</h2></center>
      </div>
    )
  }
};

export default CacheNotifier;