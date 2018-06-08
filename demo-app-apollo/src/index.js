// this is the application entry point, which will be bundled by the webpack

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './store';
import gql from "graphql-tag";
import { ApolloClient, ApolloProvider } from 'react-apollo';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';


const client = new ApolloClient({
  uri: "https://w5xlvm3vzz.lp.gql.zone/graphql"
});

client.query({
  query: gql`
    {
      rates(currency: "USD") {
        currency
      }
    }
  `
})
  .then(result => console.log('RESULTS OF SHITTY QUERY: ', result));

render(
  <ApolloProvider client={client} store={store}>
    <App/>
  </ApolloProvider>
  , document.getElementById('contents')
);