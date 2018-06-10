import React, { Component } from 'react'
import { render } from 'react-dom'
import GitBox from "./GitBox.jsx";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gitBoxes: []
    };
    this.getBooksByAuthor = this.getBooksByAuthor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  
  componentDidMount() {
    this.getBooksByAuthor();
  }
  
  getBooksByAuthor(terms = 'graphql', language = 'Javascript', stars, num = 10) {
    if (!stars || stars === 0) stars = 10;
    console.log('fetching results... terms: ', terms, ', language: ', language, ', stars: ', stars);
    if (isNaN(stars)) return window.alert('# of stars must be a number!');
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { "Content-Type": "application/graphql", "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d" },
      body: JSON.stringify({
        query: `{
          search(query: "${terms} language:${language} stars:>${stars}", type: REPOSITORY, first: ${num}) {
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
        }`,
      }),
    })
      .then(res => res.json())
      .then((res) => {
        console.log(res.data.search.edges)
        const newBoxes = res.data.search.edges.map((repo, index) => {
          return <GitBox key={`b${index}`} name={repo.node.name} stars={repo.node.stargazers.totalCount} forks={repo.node.forks.totalCount}/>
        });
        this.setState({ gitBoxes: newBoxes });
      });
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
        <h3>Search Repositories</h3>
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
        <div className="result-list">
          {this.state.gitBoxes}
        </div>
      </div>
    )
  }
}

export default App;