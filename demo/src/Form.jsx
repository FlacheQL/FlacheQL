import React, { Component } from 'react';

const Form = (props) => (
  <div id="form-wrapper">
    <h2>Find Github Repositories</h2>
    <div className="searchBoxes">
      <label>Search: <input id="searchText" type="text" className="text"/></label>
    </div>
    <div className="searchBoxes">
      <label>Language: <input id="searchLang" type="text" className="text"/></label>
    </div>
    <div className="searchBoxes">
      <label># of ☆: <input id="searchStars" type="text" className="text"/></label>
    </div>
    <div className="searchBoxes">
      <label># to fetch: <input id="searchNum" type="text" className="text"/></label>
    </div>
    <fieldset>
      <legend>More Options</legend>
      <div>
      <label><input id="databaseId" type="checkbox" className="searchOptions" value="databaseId"/> database Id</label><br/>
      <label><input id="createdAt" type="checkbox" className="searchOptions" value="createdAt"/> created At</label><br/>
      <label><input id="updatedAt" type="checkbox" className="searchOptions" value="updatedAt"/> updated At</label><br/>
      <label><input id="homepageUrl" type="checkbox" className="searchOptions" value="homepageUrl"/> homepage Url</label>
      </div>
    </fieldset>
    <button onClick={props.handleSubmit}>Search</button>
  </div>
);

export default Form;