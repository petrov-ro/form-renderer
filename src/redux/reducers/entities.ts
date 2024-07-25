import {AnyAction, createReducer, Reducer} from '@reduxjs/toolkit';
import { setEntity } from "../actions/entities";

export type DictsState = {
  [dict: string]: any[];
}

const initialState: DictsState = {
}

const dicts: Reducer<DictsState> = createReducer<DictsState>(initialState,
    (builder) => {
      builder
          .addCase(setEntity, (state: DictsState, action: AnyAction) => {
            state[action.payload.name] = {entity: action.payload.entity, loading: action.payload.loading}
          })
    }
)

export default dicts