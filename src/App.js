import React, { Component } from 'react';
import axios from 'axios'
import  ReactHighcharts from 'react-highcharts'
import { parse } from './by-tag'

class App extends Component {
  state = {
    serie: null,
    tags: null,
    error: null
  }
  componentDidMount () {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('toggle_api_key')
    if (!token) return this.setState({ error: 'NO_TOKEN' })
    axios({
      url: 'https://www.toggl.com/api/v8/time_entries',
      auth: {
        password: 'api_token',
        username: token
      }
    })
    .then(({ data }) => {
      this.setState({ ...parse(data) })
    })
    .catch((error) => {
      if (error.response && error.response.status === 403) {
        this.setState({ error: 'INVALID_TOKEN' })
      }
    })
  }
  render() {
    const { data, tags, error } = this.state
    if (error === 'NO_TOKEN') {
      return <h2>You must provide your Toggle API Token in the URL with: ?toggle_api_key=xxxx</h2>
    }
    if (error === 'INVALID_TOKEN') {
      return <h2>Your token is invalid</h2>
    }
    if (!data) return null
    return (
      <div>
        <ReactHighcharts config={{
          chart: {
            type: 'column'
          },
          title: {
            text: 'Time spent by tag'
          },
          xAxis: {
            categories: tags
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Duration (in hours)'
            }
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            column: {
              stacking: 'normal'
            }
          },
          series: [{name: 'xx', data}],
          tooltip: {
            formatter: function () {
              return `${this.key}<br/><b>${this.point.duration.as('minutes').toFixed(0)}min</b>`
            }
          }
        }} />
      </div>
    );
  }
}

export default App;
