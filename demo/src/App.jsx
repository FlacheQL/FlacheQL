import React, { Component } from 'react';
import { Redirect } from 'react-router';
// import route Components here
import Main from './Main.jsx';
import Docs from './Documentation.jsx';

import {
  HashRouter,
  Route,
  Link,
} from 'react-router-dom';

import Home from './Home.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    console.log(this);
  }

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

          <Route path="/github" render={() => <Main client={this.props.client} />} />
          <Route path="/yelp" render={() => <div><center>YELP DOESN'T EVEN EXIST YET</center></div>} />
          <Route path="/documentation" component={Docs} />
          {/* <Route path = "/" exact={true} component={Home} /> */}
          <Route path="/home" component={Home} />
          {/* SET BASE ROUTE HERE */}
          <Redirect from="/" to="/home" />

        </div>
      </HashRouter>
    );
  }
}

export default App;