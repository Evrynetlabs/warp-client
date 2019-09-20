import { createStore, applyMiddleware } from 'redux'
import createReducer from '@/reducers'
import { WarpReducer } from 'Components/warp'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

export const history = createBrowserHistory()

const rootReducer = createReducer({
  warp: WarpReducer,
  router: connectRouter(history),
})

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history))),
)

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(rootReducer)
    })
  }
}

export default store
