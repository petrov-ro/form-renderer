import {combineReducers} from 'redux'
import dicts from "./dicts";
import entities from "./entities";
import flc from "./flc";

const initialState = {
  dicts: {},
  entities: {},
  flc: {
    hiding: []   // идентификаторы элементов, которые нужно скрыть
  }
}

const appReducer = combineReducers({
  dicts,
  entities,
  flc
})

const rootReducer = (state, action) =>
  appReducer(state, action)

export default rootReducer
