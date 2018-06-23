import React from 'react';
import ReactDom from 'react-dom';
import Gist from 'react-gist';


class Features extends React.Component {
  render() {
    return (
      <div className="backdrop"  >
       <div className="modal" >
        <h1>Features</h1>
        <div className="description"> 
          FlacheQL offers developers useful features not found in other GraphQL caching libraries. Notably, the ability to define subsets of data and retrieve them from the cache when data is present.
          Furthermore, FlacheQL normalizes query and response data to allow for partial-query caching and responses. If the fields of an incoming query are contained in a cached query, Flache will fetch from the cache instead of making a roundtrip to the database.
          <br /> <br /> Developers must define the rules that would render data subsets of other data. This is accomplished by defining options based on query variables and the character of the dataset. Example options for the Github GraphQL API are presented below. In this instance 
          it is understood that a greater number of stars on a Repository will ultimately yeild less search results, and that a smaller number of repositories being searched will also yeild fewer results. Thus both parameters are specified as qualifications of subset retrievals.
          A developer must also define the features they would like to employ via a boolean on the retrieval fields.
          <Gist id='b121f9bbac8cd353b77ad44f034fdbe2' />
        </div>
        <button onClick={this.props.onClose}>Close</button>
        </div>
      </div>
    )
  }
}

export default Features;