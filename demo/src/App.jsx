import React, { Component } from 'react';
import { Redirect } from 'react-router';

// import route Components here
import Main from './GitHub';
import Docs from './Documentation.jsx';

import {
  HashRouter,
  Route,
  Link,
} from 'react-router-dom';

import { HashRouter, Route, Link } from 'react-router-dom';

import GitHub from './GitHub';
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
            <center><Link to="/github"><div>Github Demo</div></Link></center>
            <center><Link to="/yelp"><div>Yelp Demo</div></Link></center>
            <center><Link to="/documentation"><div>Docs</div></Link></center>
          </div>
          <hr />
<<<<<<< HEAD

          <Route path="/github" render={() => <Main client={this.props.client} />} />
          <Route path="/yelp" render={() => <div><center>YELP DOESN'T EVEN EXIST YET</center></div>} />
          <Route path="/documentation" component={Docs} />
          {/* <Route path = "/" exact={true} component={Home} /> */}
          <Route path="/home" component={Home} />
          {/* SET BASE ROUTE HERE */}
          <Redirect from="/" to="/home" />

=======
          <Route exact path="/github" render={() => <GitHub client={this.props.client} />} />
          <Route exact path="/yelp" render={() => <Yelp />} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/" component={Home} />
>>>>>>> yelp
        </div>
      </HashRouter>
    );
  }
}

export default App;