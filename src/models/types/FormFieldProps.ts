import {FormItemProps} from "antd/es/form/FormItem";
import {ColProps} from "antd/es/grid/col";
import {FormItemTypes} from "../../constants/FormItemTypes";
import {FormListFieldData} from "antd/es/form/FormList";
import {CSSProperties, ReactNode} from "react";
import {ColumnValTypesEnum} from "../../constants/EntityAttrValTypes";
import {StatisticsFormElementClass} from "../classes/StatisticsFormElementClass";

export type FormFieldProps<T = any> = Omit<FormItemProps<T>, 'children'> & ColProps & {
  field?: FormListFieldData
  value?: T
  onChange?: (value: T) => void
  checked?: boolean
  styleLabel?: CSSProperties
  disabled?: boolean
  readOnly?: boolean
  fieldProps?: any
  inline?: boolean;
  inlineVertical?: boolean;
  loading?: boolean
  placeholder?: string
  inputType?: FormItemTypes | undefined
  valueTypeBasic?: ColumnValTypesEnum | undefined // тип для случая многозначного поля
  tooltip?: string
  titleValue?: string
  currentElement?: StatisticsFormElementClass
  visibleLabelCol?: boolean
}
