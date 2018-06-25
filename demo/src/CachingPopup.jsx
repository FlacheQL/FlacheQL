import React from 'react';
import ReactDom from 'react-dom';
import Gist from 'react-gist';


class Caching extends React.Component {
  
  render() {

    return (
      <div className="backdrop"  >
       <div className="modal" >
        <h1>Implementation</h1>
          <div className="description"> FlacheQL offers developers the advantage of simple deployment. After the NPM package has been installed into the relevant directories, import Flache into the top level of your application's component. Next, instantiate a new instance of the Flache constructor (here referred to as 'cache'), and then invoke the .it method of the flache constructor. <br /> 
          <Gist id='ae91f1e8187f40b23308bfbcfbcd8eaf' />
          If you require headers to authenticate for a given GraphQL endpoint, they can be included as follows:
          <Gist id='de8b49d7cfab576979ad0624c4459c9d' />
          </div>
          <button onClick={this.props.onClose}>Close</button>
        </div>
      </div>
    )
  }
}

export default Caching;