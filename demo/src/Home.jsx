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
          <Link to="/github"><div className="landing-link">GitHub</div></Link>
          <Link to="/yelp"><div className="landing-link">Yelp</div></Link>
        </div>
        <div className="landing-link-wrapper">
          <Link to="/github"><div className="landing-link">Browse the Docs</div></Link>
        </div>
      </center>
    </div>
  );
}
export default Home;