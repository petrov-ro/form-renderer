import React from "react";
import {FormFieldProps} from "../../../../models/types/FormFieldProps";
import {ColumnValTypesEnum} from "../../../../constants/EntityAttrValTypes";

export type ValuesArrayFieldType = Partial<FormFieldProps> & {
    valueTypeBasic: ColumnValTypesEnum
}

const ValuesArrayField: React.FC<ValuesArrayFieldType> = (props: ValuesArrayFieldType): JSX.Element => {
    const {value = [], onChange: onChangeField} = props;

    return (
        <>
            {value.map((v, i) => (
                <span key={i}>{v}</span>
            ))
            }
        </>
    )
}

export default ValuesArrayField
