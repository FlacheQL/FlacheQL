import React, { Component } from 'react';

const Form = props => {
  return (
  <div id="form-wrapper">
    <h2>{props.title}</h2>
    {props.fields.map((field, i) => {
      return <div key={`field${i}`} className="searchBoxes"><label>{field.label}<input id={field.id} type="text" className="text" /></label><br/></div>;
    })}
    <fieldset>
      <legend>More Options</legend>
      <div className="fieldset-wrapper">
        {props.extras.map((extra, i) => {
          return <label key={`label${i}`}><input id={extra.id} type="checkbox" className="searchOptions" value={extra.id} /> {extra.label}</label>
        })}
      </div>
    </fieldset>
    <button onClick={props.handleSubmit}>Search</button>
  </div>
)};

export default Form;