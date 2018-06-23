import React, { Component } from 'react';
import GitBox from "./GitBox.jsx";
import QueryTimer from './QueryTimer.jsx';
import Flache from '../flache';
import gql from 'graphql-tag';

class App extends Component {
    constructor(props) {
      super(props);
      this.cache = new Flache();
      this.state = {
        gitBoxes: [],
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
        setTimeout(() => {
          this.getResturaunts('react', 'javascript', 50000, 100, ['']);
        }, 1000)
      }

      getResturaunts(terms, languages, stars, num, extraFields) {
        const endpoint = 'https://api.yelp.com/v3/graphql'
        const headers = { "Content-Type": "application/graphql", "Authorization: u6WuXjHK54xxA5FRqJK8WLdHSif6aVwrIQc_dBJK3CQ3H7lSyjN64NK3aGsOPyc8q40Kg3TOJjY7a81vs4-Y8-2_a0wRBysmu8FGvHcBFgf_ybiM8sMOAU78OD0tW3Yx" }
        const variables = { 
          terms,
          languages,
          stars,
          num,
        }
        const options = {
          paramRetrieval: true,
          fieldRetrieval: true,
          defineSubsets: {
            "terms": "=",
            "languages": "> string",
            "rating": ">= number",
            "num": "<= number"
          },
          queryPaths: {
            "stars": "node.stargazers.totalCount" 
          },
          pathToNodes: "data.search.edges"
        }
        const flacheQuery = this.buildQuery(terms, languages, stars, num, true, extraFields);
        const apolloQuery = this.buildQuery(terms, languages, stars, num, false, extraFields);
        // start flache timer
        this.startTimer(true, num);
        // launch flache query
        this.cache.it(flacheQuery, variables, endpoint, headers, options)
          .then(res => {
            this.handleResponse(res.data, true)
          });
        // start apollo timer
        this.startTimer(false, num);
        // launch apollo query
        this.apolloClient.query({ query: apolloQuery }).then(res => this.handleResponse(res.data, false));
      }


  buildQuery(terms, languages, stars, num, flache, extraFields) {
    if (!num || num === 0) return window.alert('bad query! you must enter a number to search for!');
    if (!terms || terms === 'graphql');
    if (num > 50) return window.alert('max 50 results!');
    const locationQuery = `"${terms || ''}${food ? ' food:' + food : ''}${rating ? ' rating:>' + rating : ''}"`;
    if (locationQuery === '""') return window.alert('bad query! you must enter at least one area to look in!');
    let str = ''; // 'createdAt databaseId'
    extraFields.forEach(e => str += '\n' + e);
    return flache ? `{
      search(term: ${searchQuery}, location: ${locationQuery}, limit: ${num}) {
        business {
            name
            rating
            reviews {
              text
              time_created
          }
        }
      }
    }` :
    gql`{
      search(query: ${searchQuery}, location: ${locationQuery}, limit: ${num}) {
        business{
          name
          rating
          reviews {
            text
          }
        }
      }
    }`;
  }

  handleResponse(res, flache) {
    this.endTimer(flache, res.search.business.length);
    this.buildBoxes(res);
  }

  buildBoxes(res) {
    const newBoxes = res.search.edges.map((repo, index) => {
      return <GitBox key={`b${index}`} name={repo.node.name} stars={repo.node.stargazers.totalCount} forks={repo.node.forks.totalCount}/>
    });
    this.setState({ gitBoxes: newBoxes });
  }

  startTimer(flache, num) {
    const reqStartTime = window.performance.now();
    const updatedTimer = { timerText: `Fetching ${num} items...`, reqStartTime, lastQueryTime: 'Please wait...' };
    // update either the flache or apollo timer
    if (flache) this.setState({ flacheTimer: updatedTimer });
    else this.setState({ apolloTimer: updatedTimer });
  }

  endTimer(flache, num) {
    const lastQueryTime = flache ? `${window.performance.now() - this.state.flacheTimer.reqStartTime} ms` : `${window.performance.now() - this.state.apolloTimer.reqStartTime} ms`;
    const updatedTimer = { timerText: `Last query fetched ${num} results in`, lastQueryTime, reqStartTime: null };
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
