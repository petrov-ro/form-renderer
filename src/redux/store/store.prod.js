import { createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import rootReducer from "../../redux/reducers";

const middlewares = [thunk]
const enhancer = [applyMiddleware(...middlewares)]

function configureStore(initialState = {}) {
  return createStore(rootReducer, initialState, ...enhancer)
}

const store = configureStore()
export default store
