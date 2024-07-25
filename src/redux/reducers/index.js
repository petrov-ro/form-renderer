import {combineReducers} from 'redux'
import dicts from "./dicts";
import entities from "./entities";

const initialState = {
  dicts: {},
  entities: {},
}

const appReducer = combineReducers({
  dicts,
  entities
})

const rootReducer = (state, action) =>
  appReducer(state, action)

export default rootReducer
