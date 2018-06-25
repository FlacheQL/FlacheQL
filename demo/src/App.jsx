import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';

import GitHub from './GitHub.jsx';
import Home from './Home.jsx';
import Yelp from './Yelp.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }

  // TODO: here is where we should initialize or destroy apollo client depending on the page selected

  render() {
    return (
      <HashRouter>
        <div>
          <div className="navigation-bar">
            <center><Link to="/home"><div>Home</div></Link></center>
            <center><Link to="/github"><div>Github</div></Link></center>
            <center><Link to="/yelp"><div>Yelp</div></Link></center>
          </div>
          <hr />
          <Route exact path="/github" render={() => <GitHub client={this.props.client} />} />
          <Route exact path="/yelp" render={() => <Yelp />} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/" component={Home} />
        </div>
      </HashRouter>
    );
  }
}

export default App;