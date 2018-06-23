// React;
import React from 'react';
// Files;
import App from './../src/App.jsx';
// Testing
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

test('should render App component correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<App />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});