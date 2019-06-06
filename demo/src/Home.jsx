import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="landing-container">
    <div id="landing-content">
      <h2>Simple Deployment. Outperforming Results.</h2>
      <p>FlacheQL is a <font className="standout">developer-friendly</font> client-side caching library for GraphQL built with two things in mind — <font className="standout">speed and efficiency</font>. Written in pure JavaScript by a small team, FlacheQL provides developers with a fast and easy way to cache GraphQL queries without sacrificing the core functionality of larger frameworks like Apollo and Relay. Additionally, FlacheQL offers partial caching on GraphQL search parameters and/or GraphQL search fields, a feature that is currently not available in <font className="standout">any other open-source caching engines</font>.</p>
      <p>Below you will find two <font className="standout">demonstrations</font> of our engine's performance on two different APIs. If you're new to GraphQL caching, try sending queries to Yelp's API to see a simple implementation of FlacheQL. If you want to see how we stack up against the leading GraphQL caching engine, Apollo Client's inMemoryCache, give the Github demo a shot.</p>
      <div className="landing-link-wrapper">
        <Link to="/yelp"><div className="landing-link"><center>Yelp Demo</center></div></Link>
        <Link to="/github"><div className="landing-link"><center>GitHub Demo</center></div></Link>
      </div>
      <br />
      <p>We also created some interactive documentation to help you set up and configure FlacheQL on your own application.</p>
      <div className="landing-link-wrapper">
        <Link to="/documentation"><div className="landing-link"><center>Docs</center></div></Link>
      </div>
      <br />
      <p>When you're ready to start using FlacheQL, you can <a className="inline-link" target="_blank" href="https://www.npmjs.com/package/flacheql">find our package on NPM</a>. This demo page was built with React — we encourage you to <a className="inline-link" target="_blank" href="http://www.github.com/FlacheQL/FlacheQL">examine the source code</a> to see how simple it is to integrate FlacheQL!</p>
    </div>
  </div>
);

export default Home;