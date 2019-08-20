import { createStore, applyMiddleware } from 'redux'
import createReducer from '@/reducers'
import { WarpReducer } from 'Components/warp'
import thunk from 'redux-thunk'

console.log(WarpReducer, 'warp reducer')
const rootReducer = createReducer({
  warp: WarpReducer,
})
export default createStore(rootReducer, applyMiddleware(thunk))
