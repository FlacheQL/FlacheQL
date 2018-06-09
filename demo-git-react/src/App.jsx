import React, { Component } from 'react'
import { render } from 'react-dom'
import GitBox from "./GitBox.jsx";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gitBoxes: []
    };
    this.getBooksByAuthor = this.getBooksByAuthor.bind(this)
  }
  
  getBooksByAuthor() {
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { "Content-Type": "application/graphql", "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d" },
      body: JSON.stringify({ query: `{
        search(query: "apollo language:JavaScript stars:>100", type: REPOSITORY, first: 10) {
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
      }`})
    })
    .then(res => res.json())
    .then(res => {
      console.log(res.data.search.edges)
      const newBoxes = res.data.search.edges.map((repo, index) => {
        return <GitBox key={index} name={repo.node.name} stars={repo.node.stargazers.totalCount} forks={repo.node.forks.totalCount}/>
      });
      console.log(newBoxes);
      this.setState({gitBoxes: newBoxes});
    })
  }
  
  componentDidMount() {
    this.getBooksByAuthor();
  }

  render() {
    return (
      <div className="main-container">
        <h3>Search Repositories</h3>
        <div className="searchBoxes">
          <label>Language: <input type="text" className="text"/></label>
        </div>
        <div className="searchBoxes">
          <label># of ✡: <input type="text" className="text"/></label>
        </div>
        <div className="searchBoxes">
          <label>Search Terms: <input type="text" className="text"/></label>
        </div>
        <input type="button" value="Search" onClick={this.getBooksByAuthor}/>
        {this.state.gitBoxes}
        <GitBox/>
      </div>
    )
  }
}

export default App;