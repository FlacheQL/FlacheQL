import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="landing-container">
    <div id="landing-content">
      <h2>Simple Deployment. Outperforming Results.</h2>
      <p>FlacheQL is a <font className="standout">developer-friendly</font> client-side caching library for GraphQL built with one thing in mind — <font className="standout">speed</font>. Written in pure javascript by a small team, our goal was to provde the fastest possible caching engine without sacrificing the core functionality of larger frameworks. Additionally, FlacheQL allows for features not available in <font className="standout">any other open-source caching engine</font>, which you can read about in the documentation.</p>
      <p>Below you will find two <font className="standout">demonstrations</font> of our engine's performance using 2 APIs which you can make queries against. If you're new to GraphQL caching, try out Yelp's API to see a simple implementation of FlacheQL. Then, try the GitHub API to see <font className="standout">how we stack up</font> against the leading GraphQL caching engine, Apollo Client's inMemoryCache.</p>
      <div className="landing-link-wrapper">
        <Link to="/yelp"><div className="landing-link"><center>Yelp Demo</center></div></Link>
        <Link to="/github"><div className="landing-link"><center>GitHub Demo</center></div></Link>
      </div>
      <br />
      <p>We have also created some interactive documentation - feel free to browse this for information on how to set up and configure FlacheQL!</p>
      <div className="landing-link-wrapper">
        <Link to="/documentation"><div className="landing-link"><center>Docs</center></div></Link>
      </div>
      <br />
      <p>When you're ready to start using FlacheQL, you can <a className="inline-link" href="https://www.npmjs.com/package/flacheql">find our package on NPM</a>. This demo page was built with React — we encourage you to <a className="inline-link" href="http://www.github.com/FlacheQL/FlacheQL">examine the source</a> to see how simple it is to integrate FlacheQL!</p>
    </div>
  </div>
);

export default Home;