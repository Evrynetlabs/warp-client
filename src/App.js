import React, { Component } from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import store, { history } from '@/store'
import Routes from '@/routes'
import '@/App.scss'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div className="app">{Routes}</div>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App
