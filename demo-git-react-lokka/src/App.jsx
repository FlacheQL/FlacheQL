import React, { Component } from 'react'
import { render } from 'react-dom'
import GitBox from "./GitBox.jsx";
import QueryTimer from './QueryTimer.jsx';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gitBoxes: [],
      reqStartTime: null,
      lastQueryTime: 'Please wait...',
      timerText: 'Last query fetched 0 items in 0ms',
    };
    this.getBooksByAuthor = this.getBooksByAuthor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.endTimer = this.endTimer.bind(this);
  }

  componentDidMount() {
    this.getBooksByAuthor('graphql', 'javascript', 5, 10);
  }

  getBooksByAuthor(terms, language, stars, num) {
    if (!num || num === 0) return window.alert('bad query! you must enter a number to search for!');
    if (!terms || terms === 'graphql');
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
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { "Content-Type": "application/graphql", "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d" },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res.data.search.edges)
        this.endTimer(res.data.search.edges.length);
        const newBoxes = res.data.search.edges.map((repo, index) => {
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
    this.getBooksByAuthor(
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