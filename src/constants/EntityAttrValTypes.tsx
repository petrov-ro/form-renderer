import {FormItemTypes} from "./FormItemTypes";
import {ReactNode} from "react";
import {isArray} from "../utils/arrayUtils";
import {
  BACK_DATE_FORMAT,
  BACK_DATE_TIME_FORMAT, BACK_TIME_FORMAT,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  gridMultivalueDelimeter,
  TIME_FORMAT
} from "./Constants";
import {convertDateToStr, convertStrToDate} from "../utils/dateUtils";
import {stringToInt} from "../utils/common";
import {EntityAttrClass} from "../models/classes/EntityAttrClass";
import * as React from "react";
import ColumnDatetimeRenderFormItem
  from "../components/Columns/ColumnDatetimeRenderFormItem/ColumnDatetimeRenderFormItem";
import TextLimit from "../components/TextLimit/TextLimit";

export enum ColumnValTypesEnum {
  TEXT = 'text',              // Строковый
  DIGIT = 'digit',            // Численный
  RADIO = 'radio',            // Логический
  DATE = 'dateTimeRange',     // Дата
  TIME = 'dateTimeRange',     // Время
  DATETIME = 'dateTimeRange', // Дата/Время
}

export enum EntityAttrValTypesEnum {
  STRING = 201,   // Строковый
  NUMBER = 202,   // Численный
  INTEGER = 203,  // Целочисленный
  BOOLEAN = 204,  // Логический
  DATE = 205,     // Дата
  TIME = 206,     // Время
  DATETIME = 207, // Дата/Время
  UUID = 208,     // UUID
  OBJECT = 209,   // Объект
}

export const EntityAttrValTypes: {
  [str: number]: {
    inputType: FormItemTypes,
    valueType: ColumnValTypesEnum,
    render?: (dataIndex: string, limit?: number) => (node: ReactNode, rec: any) => ReactNode // отрисовка элемента в гриде
    renderFormItem?: (originProps: { originProps?: any }) => JSX.Element // отрисовка элемента на форме поиска
  }
} = {
  [EntityAttrValTypesEnum.STRING]: {
    inputType: FormItemTypes.text,
    valueType: ColumnValTypesEnum.TEXT,
    render: (dataIndex: string, limit: number = 0) => (node: ReactNode, rec: any) =>
        <TextLimit text={rec?.[dataIndex]} limit={limit}/>
  },
  [EntityAttrValTypesEnum.NUMBER]: {
    inputType: FormItemTypes.number,
    valueType: ColumnValTypesEnum.DIGIT,
    render: (dataIndex: string) => (node: ReactNode, rec: any) => {
      if (rec) {
        const val = rec[dataIndex]
        return isArray(val) ? (val as number[]).join(gridMultivalueDelimeter) : val
      }
      return undefined
    },
  },
  [EntityAttrValTypesEnum.INTEGER]: {
    inputType: FormItemTypes.integer,
    valueType: ColumnValTypesEnum.DIGIT,
    render: (dataIndex: string) => (node: ReactNode, rec: any = {}) => {
      if (rec) {
        const val = rec[dataIndex]
        const values = (isArray(val) ? val : [val]) as number[]
        return values
            .filter(v => !!v)
            .map(v => stringToInt(v.toString()))
            .join(gridMultivalueDelimeter)
      }
      return undefined
    },
  },
  [EntityAttrValTypesEnum.BOOLEAN]: {
    inputType: FormItemTypes.checkbox,
    valueType: ColumnValTypesEnum.RADIO
  },
  [EntityAttrValTypesEnum.DATE]: {
    inputType: FormItemTypes.date,
    valueType: ColumnValTypesEnum.DATE,
    render: (dataIndex: string) => (node: ReactNode, rec: any) => {
      const dateStr = rec[dataIndex]
      const values = (isArray(dateStr) ? dateStr : [dateStr]) as string[]
      return values
          .map(v => {
            const date = convertStrToDate(v, BACK_DATE_FORMAT)
            return date ? convertDateToStr(date, DATE_FORMAT) : ''
          })
          .join(gridMultivalueDelimeter)
    },
    renderFormItem: () =>
        <ColumnDatetimeRenderFormItem
            format={DATE_FORMAT}
            allowEmpty={[true, true]}
        />,
  },
  [EntityAttrValTypesEnum.TIME]: {
    inputType: FormItemTypes.time,
    valueType: ColumnValTypesEnum.TIME,
    render: (dataIndex: string) => (node: ReactNode, rec: any) => {
      const dateStr = rec[dataIndex]
      const values = (isArray(dateStr) ? dateStr : [dateStr]) as string[]
      return values
          .map(v => {
            const date = convertStrToDate(v, BACK_TIME_FORMAT)
            return date ? convertDateToStr(date, TIME_FORMAT) : ''
          })
          .join(gridMultivalueDelimeter)
    },
    renderFormItem: () =>
        <ColumnDatetimeRenderFormItem
            format={TIME_FORMAT}
            allowEmpty={[true, true]}
        />,
  },
  [EntityAttrValTypesEnum.DATETIME]: {
    inputType: FormItemTypes.datetime,
    valueType: ColumnValTypesEnum.DATETIME,
    render: (dataIndex: string) => (node: ReactNode, rec: any) => {
      const dateStr = rec[dataIndex]
      const values = (isArray(dateStr) ? dateStr : [dateStr]) as string[]
      return values
          .map(v => {
            const date = convertStrToDate(v, BACK_DATE_TIME_FORMAT)
            return date ? convertDateToStr(date, DATE_TIME_FORMAT) : ''
          })
          .join(gridMultivalueDelimeter)
    },
    renderFormItem: () =>
        <ColumnDatetimeRenderFormItem
            format={DATE_TIME_FORMAT}
            allowEmpty={[true, true]}
            showTime
        />,
  },
  [EntityAttrValTypesEnum.UUID]: {
    inputType: FormItemTypes.uuid,
    valueType: ColumnValTypesEnum.TEXT
  },
  [EntityAttrValTypesEnum.OBJECT]: {
    inputType: FormItemTypes.object,
    valueType: ColumnValTypesEnum.TEXT
  },
}

/**
 * Получение типа поля для атрибута
 * @param attr - атрибут сущности
 */
export const valueTypeByAttr = ({multivalued, valueTypeId = EntityAttrValTypesEnum.STRING}: EntityAttrClass): FormItemTypes => {
  if (multivalued) {
    return FormItemTypes.values
  }
  return EntityAttrValTypes[valueTypeId]?.inputType || FormItemTypes.text
}

/**
 * Получение типа поля для атрибута
 * @param attr - атрибут сущности
 */
export const valueTypeBasicByAttr = ({valueTypeId = EntityAttrValTypesEnum.STRING}) =>
    EntityAttrValTypes[valueTypeId]?.valueType || ColumnValTypesEnum.TEXT
