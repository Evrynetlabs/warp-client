import { createStore, applyMiddleware } from 'redux'
import createReducer from '@/reducers'
import { WarpReducer } from 'Components/warp'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const rootReducer = createReducer({
  warp: WarpReducer,
})

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)),
)

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('@/reducers', () => {
      store.replaceReducer(rootReducer)
    })
  }
}

export default store
