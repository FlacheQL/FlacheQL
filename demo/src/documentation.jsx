import React, { Component } from 'react';
import Setup from './SetupPopup.jsx';
import Caching from './CachingPopup.jsx';
import Features from './Features.jsx';



class Documentation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docTopics: ['Setup', 'Caching', 'Features'],
      activeModal: null
    }

    this.clickHandler = this.clickHandler.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  clickHandler(e, index) {
    this.setState({ activeModal: index });
    document.getElementById("modal-overlay").style.display = "block";
  }

  hideModal() {
    this.setState({ activeModal: null });
    document.getElementById("modal-overlay").style.display = "none";
  }

  onKeyDown(e) {
    if (e.keyCode === 27) this.hideModal();
    console.log('keypress, keycode: ', e.keyCode);
    document.getElementById("modal-overlay").style.display = "none";
  } 

  render () {
    let i = 0;
    let list = this.state.docTopics.map( (topic, index) => {
      return <button className="doc-container" key={i++} onClick={(e) => this.clickHandler(e, index)} onKeyDown={(e) => this.onKeyDown(e)}>{topic}</button>
    });

    return (
      <div id="docs-wrapper">
        <div className="flex-container">
          {list}

          {this.state.activeModal === 0 ? 
            <Setup isOpen={this.state.activeModal} onClose={this.hideModal}>
                <p>Modal</p>
            </Setup>
            : <div></div>
          }
        
          {this.state.activeModal === 1 ?
            <Caching isOpen={this.state.activeModal} onClose={this.hideModal}>
              <p>Modal</p>
            </Caching>
            : <div></div>
          }

          {this.state.activeModal === 2 ?
            <Features isOpen={this.state.activeModal} onClose={this.hideModal}>
              <p>Modal</p>
            </Features>
            : <div></div>
          }

        </div>
      </div>
    )
  } 
}

export default Documentation;