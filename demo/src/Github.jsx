import React, { Component } from 'react';
import gql from 'graphql-tag';
import Flache from '../flache';
import Form from './Form.jsx';
import GitBox from "./GitBox.jsx";
import QueryTimer from './QueryTimer.jsx';
import Instructions from './InstructionModal.jsx';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

class GitHub extends Component {
  constructor(props) {
    super(props);
    /* Flache Implementation */
    this.cache = new Flache();
    this.state = {
      moreOptions: {
        createdAt: false,  
        databaseId: false,
        homepageUrl: false,
        updatedAt: false
      },
      gitBoxes: [],
      flacheTimer: {
        reqStartTime: null,
        lastQueryTime: 'Please wait...',
        timerText: 'Last query fetched 0 results in',
      },
      flacheTimerClass: 'timerF',
      apolloTimer: {
        reqStartTime: null,
        lastQueryTime: 'Please submit query...',
        timerText: 'Last query fetched 0 results in',
      },
      apolloTimerClass: "timerF",
      activeModal: null
    };
    this.headers = { "Content-Type": "application/graphql", "Authorization": "token d5db50499aa5e2c144546249bff744d6b99cf87d" }
    this.endpoint = 'https://api.github.com/graphql';
    this.handleMoreOptions = this.handleMoreOptions.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getRepos = this.getRepos.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.buildBoxes = this.buildBoxes.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.endTimer = this.endTimer.bind(this);
    this.flashTimer = this.flashTimer.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  /* Modal Display */
  hideModal() {
    this.setState({ activeModal: null })
    this.flache = new Flache();
    this.apolloClient;
  }

  showModal() {
    this.setState({ activeModal: Instructions })
  }  

  /* initial modal render */
  componentDidMount() {
    console.log('mounted, active modal: ', this.state.activeModal);
    setTimeout(() => {this.showModal();}, 250)
    // ---- SETUP CACHING ENGINES ----
    // ---- INIT APOLLO CLIENT ----
    const httpLink = new HttpLink({uri: this.endpoint });
    const authLink = setContext(() => ({
      headers: this.headers,
    }));
    const link = authLink.concat(httpLink)
    this.apolloClient = new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
    // initial fetch
    setTimeout(() => {
      this.getRepos('react', 'javascript', 50000, 100, ['']);
    }, 1000);
  }

  /**
  * Prepares user input and developer configs together for fetches through the cache
  * @param {string} terms The search string
  * @param {string} languages The languages to limit result set
  * @param {number} stars The minimum number of stars to limit result set
  * @param {number} num The number of results to fetch, entered by the user in an input box
  * @param {array} extraFields An array containing information on which checkbokes are ticked
  */
  getRepos(terms, languages, stars, num, extraFields) {
    const flacheQuery = buildQuery(terms, languages, stars, num, true, extraFields);
    const apolloQuery = buildQuery(terms, languages, stars, num, false, extraFields);
    // refer to the documentation for details on these options
    // FIXME: integrate this configuration with flache initialization, it never changes
    const options = {
      paramRetrieval: true,
      fieldRetrieval: true,
      defineSubsets: {
        terms: '=',
        languages: '> string',
        stars: '>= number',
        num: '<= number',
      },
      queryPaths: { stars: 'node.stargazers.totalCount' },
      pathToNodes: 'data.search.edges',
    };
    const variables = { 
      terms,
      languages,
      stars,
      num,
    };
    // start apollo timer - THAT'S RIGHT, WE RUN THEM FIRST - NO SHENANIGANS
    this.startTimer(false, num);
    // launch apollo query
    this.apolloClient.query({ query: apolloQuery })
      .then(res => this.handleResponse(res.data, false));
    // start flache timer
    this.startTimer(true, num);
    // launch flache query
    this.flache.it(flacheQuery, variables, this.endpoint, this.headers, options)
      .then(res => this.handleResponse(res.data, true));
  }

  /**
  * Function to call when response is received from either the cache or from a fetch. Dispatches payload to this.buildBoxes.
  * @param {object} res The response data from a cache hit or fetch
  * @param {boolean} flache Determines which timer to update, true for Flache, false for Apollo
  */
  handleResponse(res, flache) {
    this.endTimer(flache, res.search.edges.length);
    this.buildBoxes(res);
  }

  /**
  * Builds or re-builds the array of GitBoxes from the query result set. Calls setState. 
  * @param {object} res The response data from a cache hit or fetch
  */
  buildBoxes(res) { 
    const newBoxes = res.search.edges.map((repo, index) => {
      return (<GitBox 
        key={`b${index}`}
        name={repo.node.name}
        stars={repo.node.stargazers.totalCount}
        forks={repo.node.forks.totalCount} 
        description={repo.node.description}
        createdAt={repo.node.createdAt}
        databaseId={repo.node.databaseId} 
        updatedAt={repo.node.updatedAt}
        homepageUrl={repo.node.homepageUrl}
        moreOptions={this.state.moreOptions} 
      />);
    });
    this.setState({ gitBoxes: newBoxes });
  }

  /**
  * Starts the timer for a caching engine and displays the number of results *requested*
  * @param {boolean} flache Determines which timer to update, true for Flache, false for Apollo
  * @param {number} num The number of results to fetch, entered by the user in an input box
  */
  startTimer(flache, num) {
    const reqStartTime = window.performance.now();
    const updatedTimer = { timerText: `Fetching ${num} items...`, reqStartTime, lastQueryTime: 'Please wait...' };
    // update either the flache or apollo timer
    if (flache) this.setState({ flacheTimer: updatedTimer });
    else this.setState({ apolloTimer: updatedTimer });
  }

  /**
  * Stops the timer for a caching engine and displays the number of results *actually retrieved*
  * @param {boolean} flache Determines which timer to update, true for Flache, false for Apollo
  */
  endTimer(flache, num) {
    let lastQueryTime = flache ? `${window.performance.now() - this.state.flacheTimer.reqStartTime}` : `${window.performance.now() - this.state.apolloTimer.reqStartTime}`;
    lastQueryTime = lastQueryTime.slice(0, lastQueryTime.indexOf('.') + 4) + ' ms';
    const updatedTimer = { timerText: `Last query fetched ${num} results in`, lastQueryTime, reqStartTime: null };
    // update either the flache or apollo timer
    if (flache) this.setState({ flacheTimer: updatedTimer });
    else this.setState({ apolloTimer: updatedTimer });
    this.flashTimer(flache);
  }

  /**
  * Simple flash effect for timer
  * @param {boolean} flache Determines which timer to update, true for Flache, false for Apollo
  */
  flashTimer(flache) {
    if (flache) {
      this.setState({ flacheTimerClass: "timerF flashF" });
      setTimeout(() => this.setState({ flacheTimerClass: "timerF" }), 200);
    } else {
      this.setState({ apolloTimerClass: "timerA flashA" });
      setTimeout(() => this.setState({ apolloTimerClass: "timerA" }), 200);
    }
  }

  /** Handles changes to the More Options checkboxes and updates state to reflect */
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

  /** Fired on search, collects input fields and calls getRepos */
  handleSubmit() {
    const extraFields = this.handleMoreOptions();
    this.getRepos(
      document.getElementById('searchText').value,
      document.getElementById('searchLang').value,
      Number(document.getElementById('searchStars').value),
      document.getElementById('searchNum').value,
      extraFields,
    );
  }

  
  render() {
    return (
      <div className="main-container">
        <div id="top-wrapper">
        {/* Modal Control */}
        {this.state.activeModal === Instructions ? 
          <Instructions isOpen={this.state.activeModal} onClose={this.hideModal} onEscape={this.escapeKey}>
              <p>Modal</p>
          </Instructions>
          : <div></div>
        }
        {/* Document Body */}
          {/* Timer Displays */}
          <div id="top-right-wrapper">
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
            <div id="buttons">
              <input type="button" value="Search" onClick={() => this.handleSubmit([''])} />
              <input type="button" value="Delete Session Storage" onClick={() => sessionStorage.clear()} />
            </div>
          <Form
            handleSubmit={this.handleSubmit}
            fields={[
              { label: 'Terms: ', id: 'searchText' },
              { label: 'Language: ', id: 'searchLang' },
              { label: '# of stars: ', id: 'searchStars' },
              { label: '# to fetch: ', id: 'searchNum' },
            ]}
            extras={[
              { label: ' Created at', id: 'createdAt' },
              { label: ' Database ID', id: 'databaseId' },
              { label: ' Homepage URL', id: 'homepageUrl' },
              { label: ' Updated at', id: 'updatedAt' },
            ]}
          />
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
      </div>
    )
  }
}

/**
* Compiles a GraphQL query string tailored to the engine it's intended for
* @param {string} terms The search string
* @param {string} languages The languages to limit result set
* @param {number} stars The minimum number of stars to limit result set
* @param {number} num The number of results to fetch, entered by the user in an input box
* @param {boolean} flache Determines which cache engine to build for, true for Flache, false for Apollo
* @param {array} extraFields An array containing information on which checkbokes are ticked
* @returns {string}
*/
function buildQuery(terms, languages, stars, num, flache, extraFields) {
  if (!num || num === 0) return window.alert('bad query! you must enter a number to search for!');
  if (!terms || terms === 'graphql');
  if (num > 100) return window.alert('max 100 results!');
  const searchQuery = `"${terms || ''}${languages ? ' language:' + languages : ''}${stars ? ' stars:>' + stars : ''}"`;
  if (searchQuery === '""') return window.alert('bad query! you must enter at least one filter!');
  let str = '';
  extraFields.forEach((e) => { str += '\n' + e });
  return flache ? `{
    search(query: ${searchQuery}, type: REPOSITORY, first: ${num}) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            name
            ${str}
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
  }` :
  gql`{
    search(query: ${searchQuery}, type: REPOSITORY, first: ${num}) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            name
            ${str}
            description
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
          }
        }
      }
    }
  }`;
}

export default GitHub;