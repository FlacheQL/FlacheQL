import React from 'react';
import ReactDom from 'react-dom';



class Instructions extends React.Component {
  
  componentDidMount() {
    window.addEventListener('keydown', this.props.onKeyDown);
  }

  render() {
    return (
       <div className="modal" >
        <h1>Github Demo</h1>
        <div className="description"> 
          <p>Welcome to the GitHub demo page for FlacheQL! The intent of this page is to allow you to test our performance against the leading GraphQL caching engine, Apollo Client.</p>
          <p>We will be searching for repos on GitHub. To start, you must enter a search term. You can throw in a programming language if you like. You can also specify a minimum number of stars to search for. You must enter the number of results you wish to receive (with a maximum value of 100, as GitHub will return no more than this).</p>
          <p>Much like with Yelp, you can refine your queries with the More Options checkboxes. Note that FlacheQL returns results from the cache for appropriate queries containing only fields it has previously cached.</p>
          <p>If you didn't catch it on the Yelp demo, then take special notice that FlacheQL will do that same kind of "subset" retrieval <i>for the query parameters</i>. In the instance of GitHub, more stars implies fewer repositories, and thus, all else the same, a query run with a higher number of stars is a subset and will be retrieved from the cache. Likewise, searching for 50 repos makes a fetch, but the same search for only 25 comes from the cache. <i>No other open-source engine includes this functionality.</i></p>
          <p>FlacheQL and Apollo's respective retrieval speed is shown in the timers. Both libraries' query calls are asynchronous (but just in case, we fire Apollo's first 😉).</p>
        </div>
        <div style={{textAlign: 'center'}}>
          <button onClick={this.props.onClose}>Close</button>
        </div>
        </div>
    )
  }
}

export default Instructions;