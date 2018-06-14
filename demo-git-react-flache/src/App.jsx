import React, { Component } from 'react';
import { render } from 'react-dom';
import GitBox from "./GitBox.jsx";
import QueryTimer from './QueryTimer.jsx';
import Flache from '../flache';
import gql from 'graphql-tag';
import http from 'http';

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
        timerText: 'Last query fetched 0 results in',
      },
      flacheTimerClass: "timer",
      apolloTimer: {
        reqStartTime: null,
        lastQueryTime: 'Please submit query...',
        timerText: 'Last query fetched 0 results in',
      },
      apolloTimerClass: "timer",
      cache: this.cache
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getRepos = this.getRepos.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.buildBoxes = this.buildBoxes.bind(this);
    this.startTimers = this.startTimers.bind(this);
    this.endTimers = this.endTimers.bind(this);
    this.flashTimer = this.flashTimer.bind(this);
    this.apolloClient = this.props.client;
  }

  componentDidMount() {
    this.getRepos('react', '', 5, 100, true);
    this.getRepos('react', '', 5, 100, false);
  }

  getRepos(terms, language, stars, num, flache) {
    this.startTimers(flache, num);
      const endpoint = 'https://api.github.com/graphql'
      const headers = { "Content-Type": "application/graphql", "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d" }
      const variables = { 
        terms,
        language,
        stars,
        num,
      }
    const query = this.buildQuery(terms, language, stars, num, flache);
    // either cache by flache or by apollo
    if (flache) {
      this.cache.it(query, variables, endpoint, headers)
<<<<<<< HEAD
        .then(res => {
          this.handleResponse(res.data, flache)
        });
    } else this.apolloClient.query({ query: query }).then(res => this.handleResponse(res.data));
=======
        .then(res => this.handleResponse(res.data, flache));
    } else {
      // use apollo cache/fetch method
      console.log('ALERT: Apollo functions not integrated!');
      // bad!!!!!
      let res = { data: {}, search: { edges: []} };
      //this.cache.it(query, variables, endpoint, headers) --> apollo goes here!
      //.then(res => this.
      this.handleResponse(res.data, flache); //invoke handle response with some dummy data?
    }
>>>>>>> 564c392f35713dca0fc07cf2f2d0788b29213db4
  }

  buildQuery(terms, language, stars, num, flache) {
    if (!num || num === 0) return window.alert('bad query! you must enter a number to search for!');
    if (!terms || terms === 'graphql');
    if (num > 100) return window.alert('max 100 results!');
    const searchQuery = `"${terms || ''}${language ? ' language:' + language : ''}${stars ? ' stars:>' + stars : ''}"`;
    if (searchQuery === '""') return window.alert('bad query! you must enter at least one filter!');
    return flache ? `{
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
    }` :
    gql`{
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
<<<<<<< HEAD
    this.endTimers(flache, res.search.edges.length);
=======
    // bad!!!!
    if (res.search === undefined) res.search = {edges: [0]}
    this.endTimer(flache, res.search.edges.length);
>>>>>>> 564c392f35713dca0fc07cf2f2d0788b29213db4
    this.buildBoxes(res);
  }

  buildBoxes(res) {
    const newBoxes = res.search.edges.map((repo, index) => {
      return <GitBox key={`b${index}`} name={repo.node.name} stars={repo.node.stargazers.totalCount} forks={repo.node.forks.totalCount}/>
    });
    this.setState({ gitBoxes: newBoxes });
  }

  startTimers(flache, num) {
    const reqStartTime = window.performance.now();
    const updatedTimer = { timerText: `Fetching ${num} items...`, reqStartTime, lastQueryTime: 'Please wait...' };
    // update either the flache or apollo timer
    if (flache) this.setState({ flacheTimer: updatedTimer });
    else this.setState({ apolloTimer: updatedTimer });
  }

  endTimers(flache, num) {
    const lastQueryTime = flache ? `${window.performance.now() - this.state.flacheTimer.reqStartTime} ms` : `${window.performance.now() - this.state.apolloTimer.reqStartTime} ms`;
    const updatedTimer = { timerText: `Last query fetched ${num} results in`, lastQueryTime, reqStartTime: null };
    // update either the flache or apollo timer
    if (flache) this.setState({ flacheTimer: updatedTimer });
    else this.setState({ apolloTimer: updatedTimer });
    this.flashTimer(flache);
  }

  // simple flash effect for timer
  flashTimer(flache) {
    if (flache) {
      this.setState({ flacheTimerClass: "timer flash" });
      setTimeout(() => this.setState({ flacheTimerClass: "timer" }), 200);
    } else {
      this.setState({ apolloTimerClass: "timer flash" });
      setTimeout(() => this.setState({ apolloTimerClass: "timer" }), 200);
    }
  }

<<<<<<< HEAD
  handleSubmit(button) {
    const flache = button === 'flache';
    const terms = document.getElementById('searchText').value;
    const language = document.getElementById('searchLang').value;
    const stars = Number(document.getElementById('searchStars').value);
    const num = document.getElementById('searchNum').value;
    console.log('')
    this.getRepos(terms, language, stars, num, false);
=======
  handleSubmit() {
    this.getRepos(
      document.getElementById('searchText').value,
      document.getElementById('searchLang').value,
      Number(document.getElementById('searchStars').value),
      document.getElementById('searchNum').value,
      true,
    );
    this.getRepos(
      document.getElementById('searchText').value,
      document.getElementById('searchLang').value,
      Number(document.getElementById('searchStars').value),
      document.getElementById('searchNum').value,
      false,
    );
>>>>>>> 564c392f35713dca0fc07cf2f2d0788b29213db4
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
<<<<<<< HEAD
            <input type="button" value="Search with FlacheQL" onClick={() => this.handleSubmit('flache')} />
            <input type="button" value="Search with Apollo" onClick={() => this.handleSubmit('apollo')} />
            <input type="button" value="Search with Apollo" onClick={() => this.handleSubmit('both')} />
=======
            <input type="button" value="Search" onClick={() => this.handleSubmit()} />
>>>>>>> 564c392f35713dca0fc07cf2f2d0788b29213db4
          </div>
          <div id="timer-wrapper">
            <QueryTimer
              class={this.state.flacheTimerClass}
              title="FlacheQL"
              lastQueryTime={this.state.flacheTimer.lastQueryTime}
              timerText={this.state.flacheTimer.timerText}
            />
            <QueryTimer
              class={this.state.apolloTimerClass}
              title="Apollo"
              lastQueryTime={this.state.apolloTimer.lastQueryTime}
              timerText={this.state.apolloTimer.timerText}
            />
          </div>
        </div>
        <div className="result-list">
          {this.state.gitBoxes}
        </div>
      </div>
    )
  }
}

export default App;