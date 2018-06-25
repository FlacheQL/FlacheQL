import React, { Component } from 'react';
import Github from './Github.jsx';
//import Yelp from './Yelp.jsx';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';


//const gitHttpLink = new HttpLink({uri: 'https://api.github.com/graphql' });
//const yelpHttpLink = new HttpLink({uri: 'https://api.yelp.com/v3/graphql' });

// import route Components here
import {
  BrowseRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

// const gitAuthLink = setContext(() => ({
//   headers: { "Content-Type": "application/graphql", "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d" }
// }));

// const gitLink = gitAuthLink.concat(gitHttpLink);

// const gitClient = new ApolloClient({
//   gitLink,
//   cache: new InMemoryCache()
// });

// const yelpClient = new ApolloClient({
//   link,
//   cache: new InMemoryCache()
// });

class App extends Component {
  render() {
    console.log('in render of app component');
    return (
    <Router>
      <div className="App">
        <div className="container">
          <ul>
            <li><Link to="/github">GitHub</Link></li>
          </ul>
          <hr/>
          <Route path="/" /> } />
          {/* <Route path="/yelp" render={() => <Yelp client={yelpClient}/> } /> */}
      </div>
    </div>
  </Router>
    );
}
export default App;