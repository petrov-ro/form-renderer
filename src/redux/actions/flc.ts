import {createAction} from '@reduxjs/toolkit';

export const hidingAdd = createAction('HIDING_ADD', (id: string) => ({payload: {id}}))

export const hidingRemove = createAction('HIDING_REMOVE', (id: string) => ({payload: {id}}))
