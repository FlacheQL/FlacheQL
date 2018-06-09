import React, { Component } from 'react'
import { render } from 'react-dom'
import GitBox from "./GitBox.jsx";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gitBoxes: []
    };
    this.getBooksByAuthor = () => {
      fetch('http://localhost:4001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `{
          author(id: 4339){
            name
            books {
              title
              isbn
            }
          }
        }`})
      })
      .then(res => res.json())
      .then(res => {
        console.log(res.data)
        const newBoxes = res.data.author.books.map((book, index) => {
          console.log(book.title);
          return <GitBox key={index} author={res.data.author.name} title={book.title} isbn={book.isbn}/>
        });
        console.log(newBoxes);
        this.setState({gitBoxes: newBoxes});
      })
    }
  }

  componentDidMount() {
    this.getBooksByAuthor();
  }

  render() {
    return (
      <div className="main-container">
        <input type="text" className="text"/>
        <input type="button" value="Search" onClick={this.getBooksByAuthor}/>
        {this.state.gitBoxes}
        <GitBox/>
      </div>
    )
  }
}

export default App;