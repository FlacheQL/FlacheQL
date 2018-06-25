import React, { Component } from 'react';
import gql from 'graphql-tag';
import YelpBox from "./YelpBox.jsx";
import QueryTimer from './QueryTimer.jsx';
import Flache from '../flache';
import Form from './Form.jsx';

console.log('yelp!');

class Yelp extends Component {
  constructor(props) {
    super(props);
    this.cache = new Flache();
    this.state = {
      moreOptions: {
        price: false,  
        review_count: false,
        phone: false,
        distance: false,
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
        lastQueryTime: 'Apollo not running...',
        timerText: 'Last query fetched 0 results in',
      },
      apolloTimerClass: "timerF",
    };
    this.getRestaurants = this.getRestaurants.bind(this);
    this.handleMoreOptions = this.handleMoreOptions.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.buildBoxes = this.buildBoxes.bind(this);
    this.buildQuery = this.buildQuery.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.endTimer = this.endTimer.bind(this);
    this.flashTimer = this.flashTimer.bind(this);
    // TODO: apollo
    // this.apolloClient = this.props.client;
  }

  componentDidMount() {
    // cache persistence
    this.cache.readFromSessionStorage();
    setTimeout(() => {
      this.getRestaurants('Venice', 10, [''], true);
    }, 1000);
  }

  componentWillUnmount() {
    // cache persistence
    // this.cache.saveToSessionStorage();
  }


  getResturaunts(location, limit, extraFields, disableApollo) {
    const endpoint = 'http://www.flacheql.io:8000/yelp'

    const headers = { "Content-Type": "text/plain",
    "Authorization": "Bearer 1jLQPtNw6ziTJy36QLlmQeZkvvEXHT53yekL8kLN8nkvXudgTZ_Z0-VVjBOf483Flq-WDxtD2jsuwS8qkpkFa08yOgEAKIchAk2RI-avamh9jxGyxhPxgyKRbgIwW3Yx", }
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
    console.log('flachequery: ', flacheQuery);
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
    // this.cache.it(flacheQuery, variables, endpoint, headers, options)
    //   .then(res => {
    //     this.handleResponse(res.data, true)
    //   });
    fetch(endpoint, { headers, method: 'POST', body: flacheQuery }).then(resp => resp.json()).then((data) => {
      this.handleResponse(data.data, true);
    });
  }

  /**
  * Compiles a GraphQL query string tailored to the engine it's intended for
  * @param {string} location The location to retrieve from
  * @param {number} limit The number of results to fetch, entered by the user in an input box
  * @param {boolean} flache Determines which cache engine to build for, true for Flache, false for Apollo
  * @param {array} extraFields An array containing information on which checkbokes are ticked
  * @returns {string}
  */
  buildQuery(location, limit, flache, extraFields) {
    if (!limit || limit === 0) return window.alert('Bad query! You must enter a number to search for.');
    if (!location || location === '') return window.alert('Bad query! You must enter a limit (less than 50).')
    if (limit > 50) return window.alert('Bad query! Max 50 results!');
    let str = '';
    extraFields.forEach(e => str += '\n' + e);
    return flache ? `{
      search(location: "${location}" limit: ${limit}) {
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
    console.log('SAVEOPTIONS: ', saveOptions);
    this.setState({ moreOptions: updateOptions });
    return saveOptions;
  }

  handleResponse(data, flache) {
    this.endTimer(flache, data.search.business.length);
    this.buildBoxes(data);
  }

  buildBoxes(data) {
    const newBoxes = data.search.business.map((business, index) => {
      // yelp often does not return a business' hours, but still returns an empty hours array anyway
      const hours = business.hours[0] ? (business.hours[0].is_open_now ? 'yes' : 'no') : 'no info';
      console.log('MOREOPTIONS: ', this.state.moreOptions);
      return (
        <YelpBox
          key={`b${index}`}
          name={business.name}
          rating={business.rating}
          hours={hours}
          categories={business.categories}
          price={business.price}
          distance={business.distance}
          review_count={business.review_count}
          phone={business.phone}
          moreOptions={this.state.moreOptions}
        />
      );
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

  /** Fired on search, collects input fields and calls getRepos */
  handleSubmit() {
    const extraFields = this.handleMoreOptions();
    this.getRestaurants(
      document.getElementById('location').value,
      document.getElementById('limit').value,
      extraFields,
      true
    );
  }

  render() {
    return (
      <div className="main-container">
        <div id="top-wrapper">
          <Form
            handleSubmit={this.handleSubmit}
            fields={[
              { label: 'Search: ', id: 'location' },
              { label: '# to fetch: ', id: 'limit' },
            ]}
            extras={[
              { label: ' Price', id: 'price' },
              { label: ' Review Count', id: 'review_count' },
              { label: ' Distance from location', id: 'distance' },
              { label: ' Phone number', id: 'phone' },
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
          {this.state.yelpBoxes}
        </div>
      </div>
    )
  }
}

export default Yelp;