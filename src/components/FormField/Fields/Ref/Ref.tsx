import React from 'react';
import {FormFieldProps} from "../../../../models/types/FormFieldProps";
import {RefViewTypes} from "../../../../constants/RefViewTypes";
import RefDropdown from "../../../RefDropdown/RefDropdown";
import RefCheckbox from "../../../RefCheckbox/RefCheckbox";

type RefProps = Partial<FormFieldProps> & {
    viewTypeForm: any
}

/**
 * Компонент вывода ссылочных атрибутов
 *
 * @param props
 * @constructor
 */
const Ref: React.FC<RefProps> = props => {
    const {
        code, value, onChange, multivalued, name, loading, disabled, viewType, exclude, viewTypeForm
    } = props

    return (
        <>
            {viewType === RefViewTypes.DROPDOWN &&
            <RefDropdown code={code} disabled={disabled} value={value}
                         label={name} onChange={onChange} multivalued={multivalued} viewTypeForm={viewTypeForm}
                         loading={loading}
                         exclude={exclude}/>
            }

            {viewType === RefViewTypes.CHECKBOX &&
            <RefCheckbox code={code} disabled={disabled} value={value}
                         label={name} onChange={onChange} multivalued={multivalued}
                         loading={loading}
                         exclude={exclude}/>
            }
        </>
    )
}

export default Ref
