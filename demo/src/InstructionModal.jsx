import React from 'react';
import ReactDom from 'react-dom';



class Instructions extends React.Component {
  
  componentDidMount() {
    window.addEventListener('keydown', this.props.onKeyDown);
  }

  render() {

    return (
       <div className="modal" >
        <h1>Git Demo</h1>
        <div className="description"> 
        Welcome to the GitHub demo page for FlacheQL! The intent of this application is to familiarize developers with the caching functionality and performance of the FlacheQL Library. <br /> <br />
        We will be searching for Repositories on GitHub, to start enter a search term into the Search input. If you desire to search for repositories tagged with a specific language, you can provide the additional serach parameter in the Language input. For an increased depth to your query, you may spcify a minimum number of stars to search for, and the number of results you wish to receive (with a maximum value of 100). <br /> <br />

        To interact with the full breadth of FlacheQL's capabilities, refine your queries with the More Options checkboxes. Note that FlacheQL returns results from the cache for queries containing partial fields of previously cached responses. <br />
        Also note that FlacheQL will return subsets of queries from the cache instead of making a round-trip to the database. In the instance of GitHub, more stars implies fewer repositories, and thus the subset will be retrieved from the cache. <br /> <br />

        A comparison of FlacheQL and Apollo's retrieval times are presented to the right, and results are displayed below the input fields.  
        </div>
        <div style={{textAlign: 'center'}}>
          <button onClick={this.props.onClose}>Close</button>
        </div>
        </div>
    )
  }
}

export default Instructions;