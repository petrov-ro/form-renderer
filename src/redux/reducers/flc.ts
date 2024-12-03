import {AnyAction, createReducer, Reducer} from '@reduxjs/toolkit';
import {hidingAdd, hidingRemove} from "../actions/flc";

export type FLCState = {
  hiding: string[];
}

const initialState: FLCState = {
    hiding: []
}

const flc: Reducer<FLCState> = createReducer<FLCState>(initialState,
    (builder) => {
      builder
          .addCase(hidingAdd, (state: FLCState, action: AnyAction) => {
             if (!state.hiding.includes(action.payload.id)) {
                 state.hiding.push(action.payload.id)
             }
          })
          .addCase(hidingRemove, (state: FLCState, action: AnyAction) => {
             if (state.hiding.includes(action.payload.id)) {
                 state.hiding = state.hiding.filter(id => id === action.payload.id)
             }
          })
    }
)

export default flc
