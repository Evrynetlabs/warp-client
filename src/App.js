import React, { Component } from 'react'
import '@/App.scss'
import { Header } from 'Components/header'
import { WarpComponent } from 'Components/warp'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import store from '@/store'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="app">
            <Header></Header>
            <Switch>
              <Route exact path="/" component={WarpComponent}></Route>
            </Switch>
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
