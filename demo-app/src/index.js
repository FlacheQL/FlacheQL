// this is the application entry point, which will be bundled by the webpack

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './store';

render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById('contents')
);