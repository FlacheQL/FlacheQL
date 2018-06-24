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
        <h2>Welcome to the FlacheQL Demo!</h2>
        <p>FlacheQL is a fast caching library for GraphQL. Here you will find a demonstration of our performance compared with a leading GraphQL caching engine, Apollo Client's inMemoryCache.</p>
        <p>We have provided 2 APIs to run queries against. You can choose an API below:</p>
        <div className="landing-link-wrapper">
          <Link to="/github"><div className="landing-link">GitHub</div></Link>
          <Link to="/yelp"><div className="landing-link">Yelp</div></Link>
        </div>
        <br />
        <p>We have also created some interactive documentation - feel free to browse this for information on how to set up and configure FlacheQL!</p>
        <h2>Documentation</h2>
        <div className="landing-link-wrapper">
          <Link to="/documentation"><div className="landing-link">Browse the Docs</div></Link>
        </div>
      </center>
    </div>
  );
}

export default Home;