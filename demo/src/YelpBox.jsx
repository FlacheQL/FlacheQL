import React, { Component } from "react";

const YelpBox = (props) => {
  const displayOptions = [];
  for (let key in props.moreOptions) {
    let index = 0;
    if (props.moreOptions[key][0] === true) {
      displayOptions.push(<div key={`c${key}${index}`} className="result-item-field">{key} : {props[props.moreOptions[key][1]] + ''} </div>);
      index += 1;
    }
  }
  const categories = props.categories.reduce((acc, e) => e.title ? e.title + ', ' + acc : acc, '').slice(0, -2);
  return (
    <div className="result-item">
      <div className="search-title"><h3>{props.name}</h3></div>
      <div className="result-item-field">Rating: {props.rating}</div>
      <div className="result-item-field">Open now: {props.hours}</div>
      <div className="result-item-field">Categories: {categories}</div>
      {displayOptions}
    </div>


  )
};

export default YelpBox;