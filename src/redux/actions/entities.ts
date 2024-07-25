import {createAction} from '@reduxjs/toolkit';
import {EntityClass} from "../../models/classes/EntityClass";

export const setEntity = createAction('ENTITY_SET', (name: string, entity: EntityClass | undefined, loading: boolean) => ({payload: {name, entity, loading}}))
