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
    this.onKey = this.onKey.bind(this);
  }

  clickHandler(e, index) {
    console.log('modal clicked: ', index);
    this.setState({ activeModal: index });
    console.log(this.state.activeModal);
  }

  hideModal() {
    this.setState({ activeModal: null })
  }

  // blur background if modal is opened
  // backgroundBlur() {
  //   if (this.state.activeModal) {

  //   }
  // }

  onKey(e) {
    if (e.keycode === 27) this.setState({ activeModal: null });
  } 

  // componentWillMount() {
  //   document.addEventListener("keydown", this.escapeKey.bind(this));
  // }
  //onKeyDown={(e) => this.escapeKey(e)}

  render () {
    let i = 0;
    let list = this.state.docTopics.map( (topic, index) => {
      return <button className="doc-container" key={i++} onClick={(e) => this.clickHandler(e, index)} onKeyDown={(e) => this.onKey(e)}>{topic}</button>
    });

    return (
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

    
      {this.state.activeModal ?
        <div className="modal-overlay" id="modal-overlay">
        </div>
        : <div></div>
      }

    </div>
    )
  } 
}

export default Documentation;