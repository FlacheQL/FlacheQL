import React, { Component } from 'react';
import { Redirect } from 'react-router';

import { HashRouter, Route, Link, Switch } from 'react-router-dom';

import GitHub from './GitHub.jsx';
import Home from './Home.jsx';
import Yelp from './Yelp.jsx';
import Docs from './Documentation.jsx';

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
            <center><Link to="/yelp"><div>Yelp Demo</div></Link></center>
            <center><Link to="/github"><div>Github Demo</div></Link></center>
            <center><Link to="/documentation"><div>Docs</div></Link></center>
          </div>

          <Switch>
            <Route exact path="/documentation" component={Docs} />
            <Route exact path="/github" render={() => <GitHub client={this.props.client} />} />
            <Route exact path="/yelp" render={() => <Yelp />} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/" component={Home} />
            <Redirect from="/" to="/home" />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default App;