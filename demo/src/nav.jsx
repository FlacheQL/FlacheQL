import React, { PropTypes } from 'react';
import { Link } from 'react-router';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      mobileNavVisible: false
    };
  }

  handleResize() {
    this.setState({windowWidth: window.innerWidth});
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  navigationLinks() {
    return [
      <ul>
        <li key={1}><Link to="documentation">Docs</Link></li>
        <li key={2}><Link to="Yelp">Yelp Demo</Link></li>
      </ul>
    ];
  }

  renderMobileNav() {
    if ( this.state.mobileNavVisible) {
      this.setState({mobileNavVisible: true});
    } else {
      this.setState({mobileNavVisible: false});
    }
  }

  renderNavigation() {
    if ( this.state.windowWidth <= 1080 ) {
      return [
        <div className="mobile_nav">
          <p onClick={this.handleClick.bind(this)}><i class="material-icons">Navigation</i></p>
          {this.renderMobileNav}
        </div>
      ];
    } else {
      return [
      <div key={7} className="nav_menu">
      {this.navigationLinks()}
      </div>
      ];
    }
  }
  
  render () {
    return (
      <div className="nav_container">
      <div className="site_title"><Link to="/documentation">Documentation</Link></div>
      {this.renderNavigation()}
      </div>
    )
 }

 
}

export default Navigation;