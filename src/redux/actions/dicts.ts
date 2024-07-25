import {createAction} from '@reduxjs/toolkit';
import {StoreDictsType} from "../../models/types/StoreDictsType";

export const setDict = createAction('DICT_SET', (name: string, dict: StoreDictsType) => ({payload: {name, dict}}))
