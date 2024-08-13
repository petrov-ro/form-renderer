import React from "react";
import {Button, Input} from "@gp-frontend-lib/ui-kit-5";
import {uuid} from "../../../../utils/common";
import {FormFieldProps} from "../../../../models/types/FormFieldProps";

type UUIDFieldType = Partial<FormFieldProps> & {}

const UUIDField: React.FC<UUIDFieldType> = (props: UUIDFieldType): JSX.Element => {
  const {onChange, disabled} = props

  // генерация произвольного значения
  const generate = () => {
    onChange?.(uuid())
  }

  return (
    <div style={{display: 'flex'}}>
      <div style={{width: '100%', paddingRight: '12px'}}>
        <Input name=''/>
      </div>

      {!disabled &&
      <div>
          <Button
              type={"primary"} ghost style={{width: '153px'}}
              onClick={generate}>
              Генерировать
          </Button>
      </div>
      }
    </div>
  )
}

export default UUIDField
