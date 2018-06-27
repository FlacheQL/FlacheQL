import React, { Component } from 'react';
import { Redirect } from 'react-router';

import { HashRouter, Route, Link, Switch } from 'react-router-dom';

import GitHub from './GitHub.jsx';
import Home from './Home.jsx';
import Yelp from './Yelp.jsx';
import Docs from './Documentation.jsx';
import logo from './img/logo.png';
import { GitIcon, NPMIcon } from './Icon.jsx';

/*eslint-disable*/

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
            <div id="logo">
              <Link to="/home"><img id="img-logo" src={logo} /></Link>
            </div>
            <div id="nav-bar-links">
            <Link to="/home"><div className="nav-bar-link">Home</div></Link>
            <div className="dropdown-wrapper"><center>Demos</center>
              <div className="dropdown-content">
                <div className="dropdown-content-wrapper">
                  <Link to="/yelp"><div className="dropdown-item">Yelp Demo</div></Link>
                  <Link to="/github"><div className="dropdown-item">Github Demo</div></Link>
                </div>
              </div>
            </div>
            <Link to="/documentation"><div className="nav-bar-link">Documentation</div></Link>
            <a href="http://www.github.com/FlacheQL/FlacheQL"><GitIcon /></a>
            <a href="https://www.npmjs.com/package/flacheql"><NPMIcon /></a>
            </div>
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