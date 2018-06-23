import React, { Component } from 'react';
// import route Components here
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

const Home = () => {
  return (
    <div className="landing-container">
      <center>
        <h3>Welcome to the FlacheQL Demo!</h3>
        <p>FlacheQL is a fast caching library for GraphQL. Here you will find a demonstration of our performance compared with a leading GraphQL caching engine, Apollo Client's inMemoryCache.</p>
        <p>We have provided 2 APIs to run queries against. Please choose an API below:</p>
        <div className="landing-link-wrapper">
          <div className="landing-link"><Link to="/github">GitHub</Link></div>
          <div className="landing-link"><Link to="/yelp">Yelp</Link></div>
        </div>
      </center>
    </div>
  );
}
export default Home;