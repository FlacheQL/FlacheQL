import React, { Component } from 'react'
import { render } from 'react-dom'
import GitBox from "./GitBox.jsx";

console.log(typeof GitBox);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log('fucking render! gitbox is a', typeof GitBox);
    return (
      <div className="main-container">
        {/* {gitBoxes} */}
        <GitBox/>
      </div>
    )
  }
}

export default App;