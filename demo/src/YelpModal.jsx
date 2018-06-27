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
         Welcome to the Yelp demo of FlacheQL! This demo is intended to provide a simple overview of FlacheQL's functionality and speed. <br /> <br />

         In the provided search fields you may provide a term to search for within the Yelp GraphQL API. This could be for bars, resturaunts, or any other services. Also provide a number of results to receive, up to 50 per Yelp's constraints. <br />
         You are able to interact with Flache's partial query retrievals in this demo, so feel free to select and de-select boxes from the More Options menu and observe the improved response times that Flache brings to your web app.  
        </div>
          <div style={{textAlign: 'center'}}>
            <button onClick={this.props.onClose}>Close</button>
          </div>
        </div>
    )
  }

}

export default YelpModal;