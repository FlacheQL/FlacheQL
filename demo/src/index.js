import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import './../src/style.css';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = new HttpLink({uri: 'https://api.github.com/graphql' });

const authLink = setContext(() => ({
  headers: { "Content-Type": "application/graphql", "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d" }
}));

const link = authLink.concat(httpLink)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <App client={client}/>,
  document.getElementById("content"),
);

