import React, { Component } from 'react'
import '@/App.scss'
import Header from 'Components/header'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Header></Header>
        </div>
        <Switch>
          <Route exact path="/"></Route>
        </Switch>
      </Router>
    )
  }
}

export default App
