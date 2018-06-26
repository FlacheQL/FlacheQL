import React from 'react';
import ReactDom from 'react-dom';
import Gist from 'react-gist';


class Setup extends React.Component {
  render() {

    return (
      <div className="modal" >
        <h1>Setup</h1>
          <div className="description"> Setup of FlacheQL is decidely simple. To start, from your terminal run: <br /> 
            <Gist id='8c235f3e5ac6e5f90c85ff2c0a84b9d1' />
            From here, import FlacheQL with your other Node modules in the application's file.
          </div>
        <button onClick={this.props.onClose}>Close</button>
      </div>
    )
  }
}

export default Setup;
