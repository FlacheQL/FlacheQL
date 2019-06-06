import React from 'react';
import ReactDom from 'react-dom';

class YelpModal extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.props.onKeyDown);
  }
  render() {

    return (
       <div className="modal" >
        <h1>Yelp Demo</h1>
        <div className="description"> 
         <p>Welcome to the Yelp demo of FlacheQL! This demo is intended to provide a simple overview of FlacheQL's functionality and speed.</p>
         <p>In the search fields, provide a location to search the Yelp GraphQL API. This could be any neighborhood or city in the US. Also, you must provide a number of results to receive, up to 50 per Yelp's constraints. These fields represent the query <i>parameters</i>.</p>
         <p>You can observe Flache's partial query matching in this demo by selecting boxes from the More Options menu. These options represent query <i>fields</i>. Start by running a search, and then deselecting one or more and running it again. Observe that FlacheQL recognizes when a full result set is in the cache even if the query does not match one already made.</p>
         <p>If you're very familiar with other GraphQL caching solutions, you may even notice something surprising about our engine's capabilities...</p>
        </div>
          <div style={{textAlign: 'center'}}>
            <button onClick={this.props.onClose}>Close</button>
          </div>
        </div>
    )
  }

}

export default YelpModal;