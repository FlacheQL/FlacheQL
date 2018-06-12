import React, { Component } from 'react'
import GitBox from "./GitBox.jsx";
import QueryTimer from './QueryTimer.jsx';
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport(('http://localhost:4001/graphql')
  , {
    "Content-Type": "application/graphql",
    "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d",
  })
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gitBoxes: [],
      reqStartTime: null,
      lastQueryTime: 'Please wait...',
      timerText: 'Last query fetched 0 items in 0ms',
    };
    this.getRepos = this.getRepos.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.endTimer = this.endTimer.bind(this);
  }

  componentDidMount() {
    this.getRepos('graphql', 'javascript', 5, 10);
  }

  getRepos(terms, language, stars, num) {
    if (!num || num === 0) return window.alert('bad query! you must enter a number to search for!');
    if (!terms) terms === 'graphql';
    if (num > 100) return window.alert('max 100 results!');
    this.startTimer(num);
    const searchQuery = `"${terms || ''}${language ? ' language:' + language : ''}${stars ? ' stars:>' + stars : ''}"`;
    if (searchQuery === '""') return window.alert('bad query! you must enter at least one filter!');
    const query = `{
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
    console.log('query to fetch: ', query);
    client.query(query)
      .then((res) => {
        console.log(res.search.edges)
        this.endTimer(res.search.edges.length);
        const newBoxes = res.search.edges.map((repo, index) => {
          return <GitBox key={`b${index}`} name={repo.node.name} stars={repo.node.stargazers.totalCount} forks={repo.node.forks.totalCount}/>
        });
        this.setState({ gitBoxes: newBoxes });
      });
  }

  startTimer(num) {
    const reqStartTime = Date.now();
    this.setState({ timerText: `Fetching ${num} items...`, reqStartTime, lastQueryTime: 'Please wait...' });
  }

  endTimer(num) {
    const lastQueryTime = `${Date.now() - this.state.reqStartTime} ms`;
    this.setState({ timerText: `Last query fetched ${num} results in`, lastQueryTime });
  }

  handleSubmit() {
    this.getRepos(
      document.getElementById('searchText').value,
      document.getElementById('searchLang').value,
      Number(document.getElementById('searchStars').value),
      document.getElementById('searchNum').value,
    );
  }

  render() {
    return (
      <div className="main-container">
        <div id="top-wrapper">
          <div id="form-wrapper">
            <h2>Search Repositories</h2>
            <div className="searchBoxes">
              <label>Search Terms: <input id="searchText" type="text" className="text"/></label>
            </div>
            <div className="searchBoxes">
              <label>Language: <input id="searchLang" type="text" className="text"/></label>
            </div>
            <div className="searchBoxes">
              <label># of ✡: <input id="searchStars" type="text" className="text"/></label>
            </div>
            <div className="searchBoxes">
              <label># to fetch: <input id="searchNum" type="text" className="text"/></label>
            </div>
            <input type="button" value="Search" onClick={this.handleSubmit} />
          </div>
          <QueryTimer
            lastQueryTime={this.state.lastQueryTime}
            timerText={this.state.timerText}
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