// React;
import React from 'react';
// Files;
import App from './../src/App.jsx';
import Flache from '../flache';
// Testing
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import { shallow, mount, render } from 'enzyme';

configure({ adapter: new Adapter() });


/**
 * Snapshot testing of initial render
 */
test('should render App component correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<App />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('input form taking in search terms, language, #, and stars renders correctly', () => {
  const tree = renderer
    .create(<div id="form-wrapper">
      <h2>Find Github Repositories</h2>
      <div className="searchBoxes">
        <label>Search: <input id="searchText" type="text" className="text"/></label>
      </div>
      <div className="searchBoxes">
        <label>Language: <input id="searchLang" type="text" className="text"/></label>
      </div>
      <div className="searchBoxes">
        <label># of ☆: <input id="searchStars" type="text" className="text"/></label>
      </div>
      <div className="searchBoxes">
        <label># to fetch: <input id="searchNum" type="text" className="text"/></label>
      </div>
      <input type="button" value="Search" onClick={() => this.handleSubmit([''])} />
      <input type="button" value="Search w/createdAt" onClick={() => this.handleSubmit(['createdAt'])} />
      <input type="button" value="Search w/createdAt and databaseId" onClick={() => this.handleSubmit(['createdAt', 'databaseId'])} />
      <input type="button" value="Search w/databaseId" onClick={() => this.handleSubmit(['databaseId'])} />
      <input type="button" value="Show query cache" onClick={() => console.log(this.cache.comparisonCache, this.cache.cache)} />
    </div>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

/**
 * Testing initial component statefulness
 */
it('Git box is instantiated as empty array upon load', () => {
  const wrapper = shallow(<App/>);
  expect(wrapper.instance().state.gitBoxes).toEqual([])
});

it('Cache is instantiated as Flache Cache', () => {
  const wrapper = shallow(<App/>);
  expect(wrapper.instance().cache).toEqual(new Flache());
});

////
it('Clicking search button with valid values makes AJAX call to the Github API', () => {
  const wrapper = shallow(<App/>);
  const instance = wrapper.instance();
  expect(instance.handleClick;
  instance.incrementCounter();
  expect(instance.state.count).toBe(1);
});