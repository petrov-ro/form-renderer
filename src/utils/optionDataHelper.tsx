import React, {ReactNode} from "react";
import OptionData from "../models/types/OptionData";
import {BaseOptionType} from "antd/es/select";
import {FlattenOptionData} from "rc-select/lib/interface";

export const newOptionData = (value: any, label?: any, p: any = {}) => ({
    value,
    label: label || value, ...p
} as OptionData)

/**
 * Рендер элементов списка
 * @param option - элемент списка
 */
export const dictOptionRender = (option: FlattenOptionData<BaseOptionType> & { item?: BaseOptionType }): ReactNode => {
    const unselectableStyle = {
        fontWeight: 'bold',
        color: 'black'
    }

    return (
        <span style={option.data.item?.isUnselectable ? unselectableStyle : undefined}>
            {option.label}
        </span>
    )
}
