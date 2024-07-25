import {AnyAction, createReducer, Reducer} from '@reduxjs/toolkit';
import { setDict } from "../actions/dicts";

export type DictsState = {
  [dict: string]: any[];
}

const initialState: DictsState = {
}

const dicts: Reducer<DictsState> = createReducer<DictsState>(initialState,
    (builder) => {
      builder
          .addCase(setDict, (state: DictsState, action: AnyAction) => {
            state[action.payload.name] = action.payload.dict
          })
    }
)

export default dicts
