import React, { Component } from 'react'
import { render } from 'react-dom'
import GitBox from "./GitBox.jsx";
import QueryTimer from './QueryTimer.jsx';
import Flache from '../flache'
// import Flache from 'flacheql';

class App extends Component {
  constructor(props) {
    super(props);
    this.cache = new Flache();
    this.state = {
      gitBoxes: [],
      flacheTimer : {
        reqStartTime: null,
        lastQueryTime: 'Please wait...',
        timerText: 'Last query fetched 0 items in 0ms',
      },
      apolloTimer: {
        reqStartTime: null,
        lastQueryTime: 'Please wait...',
        timerText: 'Last query fetched 0 items in 0ms',
      },
      cache: this.cache
    };
    this.getBooksByAuthor = this.getBooksByAuthor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.endTimer = this.endTimer.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.buildBoxes = this.buildBoxes.bind(this);
  }

  componentDidMount() {
    this.getBooksByAuthor('react', '', 5, 10, true);
  }

  getBooksByAuthor(terms, language, stars, num, flache) {
    this.startTimer(flache, num);
    const endpoint = 'https://api.github.com/graphql'
    const headers = { "Content-Type": "application/graphql", "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d" }
    const query = this.buildQuery(terms, language, stars, num);
    // either fetch by flache or by apollo
    if (flache) {
      this.cache.it(query, endpoint, headers)
        .then(res => this.handleResponse(res.data, flache));
    } else {
      // use apollo cache/fetch method
      console.log('ALERT: Apollo functions not integrated!');
    }
  }

  buildQuery(terms, language, stars, num) {
    if (!num || num === 0) return window.alert('bad query! you must enter a number to search for!');
    if (!terms || terms === 'graphql');
    if (num > 100) return window.alert('max 100 results!');
    const searchQuery = `"${terms || ''}${language ? ' language:' + language : ''}${stars ? ' stars:>' + stars : ''}"`;
    if (searchQuery === '""') return window.alert('bad query! you must enter at least one filter!');
    return `{
      search(query: ${searchQuery}, type: REPOSITORY, first: ${num}) {
        repositoryCount
        edges {
          node {
            ... on Repository {
              name
              descriptionHTML
              stargazers {
                totalCount
              }
              forks {
                totalCount
              }
              updatedAt
            }
          }
        }
      }
    }`;
  }

  handleResponse(res, flache) {
    this.endTimer(flache, res.search.edges.length);
    this.buildBoxes(res);
  }

  buildBoxes(res) {
    const newBoxes = res.search.edges.map((repo, index) => {
      return <GitBox key={`b${index}`} name={repo.node.name} stars={repo.node.stargazers.totalCount} forks={repo.node.forks.totalCount}/>
    });
    this.setState({ gitBoxes: newBoxes });
  }

  startTimer(flache, num) {
    const reqStartTime = Date.now();
    const updatedTimer = { timerText: `Fetching ${num} items...`, reqStartTime, lastQueryTime: 'Please wait...' };
    // update either the flache or apollo timer
    if (flache) return this.setState({ flacheTimer: updatedTimer });
    return this.setState({ apolloTimer: updatedTimer });
  }

  endTimer(flache, num) {
    const lastQueryTime = flache ? `${Date.now() - this.state.flacheTimer.reqStartTime} ms` : `${Date.now() - this.state.apolloTimer.reqStartTime} ms`;
    // console.log('endTimer: lastQueryTime: ', lastQueryTime, '\n, flache?: ', flache);
    const updatedTimer = { timerText: `Last query fetched ${num} results in`, lastQueryTime, reqStartTime: null };
    // update either the flache or apollo timer
    if (flache) return this.setState({ flacheTimer: updatedTimer });
    return this.setState({ apolloTimer: updatedTimer });
  }

  handleSubmit(button) {
    const flache = button === 'flache';
    this.getBooksByAuthor(
      document.getElementById('searchText').value,
      document.getElementById('searchLang').value,
      Number(document.getElementById('searchStars').value),
      document.getElementById('searchNum').value,
      flache,
    );
  }

  render() {
    return (
      <div className="main-container">
        <div id="top-wrapper">
          <div id="form-wrapper">
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
            <input type="button" value="Search" onClick={() => this.handleSubmit('flache')} />
          </div>
          <QueryTimer
            lastQueryTime={this.state.flacheTimer.lastQueryTime}
            timerText={this.state.flacheTimer.timerText}
          />
        </div>
        <div className="result-list">
          {this.state.gitBoxes}
        </div>
      </div>
    )
  }
}

export default App;