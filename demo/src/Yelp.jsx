import React, { Component } from 'react';
import gql from 'graphql-tag';
import YelpBox from "./YelpBox.jsx";
import QueryTimer from './QueryTimer.jsx';
import Flache from '../flache';
import Form from './Form.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.cache = new Flache();
    this.state = {
      moreOptions: {
        price: false,  
        review_count: false,
        phone: false,
        review_count: false
      },
      yelpBoxes: [],
      flacheTimer : {
        reqStartTime: null,
        lastQueryTime: 'Please wait...',
        timerText: 'Last query fetched 0 results in',
      },
      flacheTimerClass: "timerF",
      apolloTimer: {
        reqStartTime: null,
        lastQueryTime: 'Please submit query...',
        timerText: 'Last query fetched 0 results in',
      },
      apolloTimerClass: "timerF",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getResturaunts = this.getResturaunts.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.buildBoxes = this.buildBoxes.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.endTimer = this.endTimer.bind(this);
    this.flashTimer = this.flashTimer.bind(this);
    this.apolloClient = this.props.client;
  }

  componentDidMount() {
    // cache persistence
    this.cache.readFromSessionStorage();
    setTimeout(() => {
      this.getRepos('react', 'javascript', 50000, 100, ['']);
    }, 1000);
  }

  componentWillUnmount() {
    // cache persistence
    this.cache.saveToSessionStorage();
  }

  getResturaunts(location, limit, extraFields, disableApollo) {
    const endpoint = 'https://api.yelp.com/v3/graphql'
    const headers = { "Content-Type": "application/graphql", "Authorization": "1jLQPtNw6ziTJy36QLlmQeZkvvEXHT53yekL8kLN8nkvXudgTZ_Z0-VVjBOf483Flq-WDxtD2jsuwS8qkpkFa08yOgEAKIchAk2RI-avamh9jxGyxhPxgyKRbgIwW3Yx" }
    const variables = { 
      limit,
    }
    const options = {
      paramRetrieval: true,
      fieldRetrieval: true,
      defineSubsets: {
        limit: '<= number',
      },
      pathToNodes: "data.search.business"
    }
    const flacheQuery = this.buildQuery(location, limit, true, extraFields);
    if (!disableApollo) {
      const apolloQuery = this.buildQuery(location, limit, false, extraFields);
      // start apollo timer
      this.startTimer(false, limit);
      // launch apollo query
      this.apolloClient.query({ query: apolloQuery }).then(res => this.handleResponse(res.data, false));
    }
    // start flache timer
    this.startTimer(true, limit);
    // launch flache query
    this.cache.it(flacheQuery, variables, endpoint, headers, options)
      .then(res => {
        this.handleResponse(res.data, true)
      });
  }

  buildQuery(location, limit, flache, extraFields) {
    if (!limit || limit === 0) return window.alert('Bad query! You must enter a number to search for.');
    if (!location || location === '') return window.alert('Bad query! You must enter a limit (less than 50).')
    if (limit > 50) return window.alert('Bad query! Max 50 results!');
    let str = '';
    extraFields.forEach(e => str += '\n' + e);
    return flache ? `{
      search(location: ${location} limit: ${limit}) {
        business {
          name
          rating
          hours {
            is_open_now
          }
          categories {
            title
          }
          ${extraFields}
        }
      }
    }` :
    gql`{
      search(location: ${location} limit: ${limit}) {
        business {
          name
          rating
          hours {
            is_open_now
          }
          categories {
            title
          }
          ${extraFields}
        }
      }
    }`;
  }

  handleMoreOptions() {
    const saveOptions = [];
    const updateOptions = {};
    const options = document.getElementsByClassName('searchOptions');
    for (let i = 0; i < options.length; i++) {
      if (options[i].checked) {
        saveOptions.push(options[i].value);
        updateOptions[options[i].value] = [true, options[i].value];
      } else updateOptions[options[i].value] = false;
    } 
    this.setState({ moreOptions: updateOptions });
    return saveOptions;
  }

  handleResponse(res, flache) {
    this.endTimer(flache, res.search.business.length);
    this.buildBoxes(res);
  }

  buildBoxes(res) {
    const newBoxes = res.search.edges.map((repo, index) => {
      return <YelpBox key={`b${index}`} name={repo.node.name} stars={repo.node.stargazers.totalCount} forks={repo.node.forks.totalCount}/>
    });
    this.setState({ yelpBoxes: newBoxes });
  }

  startTimer(flache, limit) {
    const reqStartTime = window.performance.now();
    const updatedTimer = { timerText: `Fetching ${limit} items...`, reqStartTime, lastQueryTime: 'Please wait...' };
    // update either the flache or apollo timer
    if (flache) this.setState({ flacheTimer: updatedTimer });
    else this.setState({ apolloTimer: updatedTimer });
  }

  endTimer(flache, limit) {
    const lastQueryTime = flache ? `${window.performance.now() - this.state.flacheTimer.reqStartTime} ms` : `${window.performance.now() - this.state.apolloTimer.reqStartTime} ms`;
    const updatedTimer = { timerText: `Last query fetched ${limit} results in`, lastQueryTime, reqStartTime: null };
    // update either the flache or apollo timer
    if (flache) this.setState({ flacheTimer: updatedTimer });
    else this.setState({ apolloTimer: updatedTimer });
    this.flashTimer(flache);
  }

  // simple flash effect for timer
  flashTimer(flache) {
    if (flache) {
      this.setState({ flacheTimerClass: "timerF flashF" });
      setTimeout(() => this.setState({ flacheTimerClass: "timerF" }), 200);
    } else {
      this.setState({ apolloTimerClass: "timerA flashA" });
      setTimeout(() => this.setState({ apolloTimerClass: "timerA" }), 200);
    }
  }

  render() {
    return (
      <div className="main-container">
        <div id="top-wrapper">
          <Form handleSubmit={this.handleSubmit} />
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