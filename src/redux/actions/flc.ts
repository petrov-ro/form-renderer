import {createAction} from '@reduxjs/toolkit';

export const limitsAdd = createAction('LIMITS_ADD', (limits: Record<string, any>) => ({payload: {limits}}))
