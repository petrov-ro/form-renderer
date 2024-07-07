import {DatePicker} from 'antd';
import {FormFieldProps} from "../../../models/types/FormFieldProps";
import {RangePickerProps} from "antd/lib/date-picker";
import * as React from "react";

const {RangePicker} = DatePicker;

type ColumnDatetimeRenderType = FormFieldProps & RangePickerProps

const ColumnDatetimeRenderFormItem: React.FC<any> = (props: ColumnDatetimeRenderType): JSX.Element => {
  const {value, onChange, ...rest} = props

  const onChangeField = (v: any) => {
    onChange?.(v)
  }

  return (
    <div className='column-datetime'>
      <RangePicker
        value={value}
        onChange={onChangeField}
        disabled={!onChange}
        {...rest}
        placeholder={['С', 'По']}
      />
    </div>
  )
}

export default ColumnDatetimeRenderFormItem
