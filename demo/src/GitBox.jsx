import React, { Component } from "react";

class GitBox extends Component { 

  render() {
    const displayOptions = [];

    for(let key in this.props.moreOptions) {
      let index = 0;
      if(this.props.moreOptions[key][0] === true) {
        displayOptions.push(<div key={`c${index}`} className="gitbox-searchResult"><strong>{key}</strong>: {this.props[this.props.moreOptions[key][1]]} </div>);
        index +=1;
      }
    }
   
    
    return (
      <div className="gitbox">
        <div className="gitbox-repo-name"><h3>{this.props.name}</h3></div>
        <div className="gitbox-searchResult"><strong>Description:</strong> {this.props.description}</div>
        <div className="gitbox-searchResult"><strong>Stars:</strong> {this.props.stars} </div>
        <div className="gitbox-searchResult"><strong>Forks:</strong> {this.props.forks}</div>
        { displayOptions }
      </div>


    )
  }
};

export default GitBox;