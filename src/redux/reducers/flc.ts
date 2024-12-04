import {AnyAction, createReducer, Reducer} from '@reduxjs/toolkit';
import {limitsAdd} from "../actions/flc";
import {objectCompare} from "../../utils/objectUtils";

export type FLCState = {
  limits: {
      [req: string]: any
  };
}

const initialState: FLCState = {
    limits: {}
}

const flc: Reducer<FLCState> = createReducer<FLCState>(initialState,
    (builder) => {
      builder
          .addCase(limitsAdd, (state: FLCState, action: AnyAction) => {
             if (!objectCompare(state.limits, action.payload.limits)) {
                 state.limits = action.payload.limits
             }
          })
    }
)

export default flc
