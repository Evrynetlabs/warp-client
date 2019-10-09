import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/App.scss'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import store, { history } from '@/store'
import { Header } from 'Components/header'
import Routes from '@/routes'

class App extends Component {
  render() {
    console.log(process.env, 'test envs')
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div className="app">
            <Header></Header>
            {Routes}
          </div>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App
