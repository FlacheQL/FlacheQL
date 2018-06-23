import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  HashRouter,
  Route,
  Link,
  Switch,
  Redirect,
} from 'react-router-dom';

import Main from './Main.jsx';
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
            <center><Link to="/github"><div>Github</div></Link></center>
            <center><Link to="/yelp"><div>Yelp</div></Link></center>
          </div>
          <hr />
          <Route exact path="/github" render={() => <Main client={this.props.client} />} />
          <Route exact path="/yelp" render={() => <div><center>YELP DOESN'T EVEN EXIST YET</center></div>} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/" component={Home} />
        </div>
      </HashRouter>
    );
  }
}

export default App;