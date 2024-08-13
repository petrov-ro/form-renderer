import React, {Component, Key, useState} from "react";
import {FormFieldProps} from "../../../../models/types/FormFieldProps";
import {TableParam} from "../../../../models/classes/TableParam";
import {isArray} from "../../../../utils/arrayUtils";
import {Space} from "antd";
import {Button, Icons} from "@gp-frontend-lib/ui-kit-5";
import {fields} from "../../FormField";
import {FormItemTypes} from "../../../../constants/FormItemTypes";
import {EntityAttrValTypes} from "../../../../constants/EntityAttrValTypes";

const PlusOutlined = Icons.Add
const DeleteOutlined = Icons.Delete

export type ValuesArrayFieldType = Partial<FormFieldProps> & {}

/**
 * Модификация значений массива, преобразование к объектам TableParam
 * @param value
 */
const convertParamsToArray = <T extends Key>(value: T | T[] = [] as T[]): TableParam[] => {
    const array = (isArray(value) ? value : [value]) as T[]
    return array.map((k: T) => new TableParam(k))
}

/**
 * Компонент для отображения/редактирования массива значений
 * @param props
 * @constructor
 */
const ValuesArrayField: React.FC<ValuesArrayFieldType> = props => {
    const {value: initialValue = [], onChange: onChangeInitial, valueTypeBasic} = props;

    // модификация значений для удобства работы с ними
    const [value, setValue] = useState(convertParamsToArray(initialValue))

    // определение компонента для отрисовки элементов
    const inputTypeKey = Object
        .keys(EntityAttrValTypes)
        .find(key => EntityAttrValTypes[key]?.valueType === valueTypeBasic)
    const inputType = inputTypeKey ? EntityAttrValTypes[inputTypeKey].inputType : FormItemTypes.text
    const Component = fields[inputType]

    /**
     * Применение измененных значений
     */
    const onChange = (newValue) => {
        setValue(newValue)
        onChangeInitial?.(newValue.map(v => v.value))
    }

    /**
     * Редактирование значения
     */
    const onChangeField = (elem, e) => {
        const newValue = e
        const values = value.map(v => v.id === elem.id ? {...elem, value: newValue} : v)
        onChange?.(values)
    }

    /**
     * Добавление пустого значения
     */
    const onCreate = () => {
        const newValue = [...value, new TableParam()]
        onChange?.(newValue)
    }

    /**
     * Удаление значения
     */
    const onRemove = (index: number) => {
        const newValues = [...value]
        newValues.splice(index, 1)
        onChange?.(newValues)
    }

    return (
        <div>
            <Space direction="vertical">
                {value
                    .map((v, i) =>
                        <Space direction={'horizontal'} key={v.id}>
                            <Component value={v.value} onChange={(e) => onChangeField(v, e)}/>
                            <Button type="primary" ghost key="primary"
                                    title='Удалить'
                                    onClick={() => onRemove(i)}>
                                <DeleteOutlined/>
                            </Button>
                        </Space>
                    )}

                <Button type="primary" ghost key="primary"
                        onClick={onCreate}>
                    <PlusOutlined/> Добавить
                </Button>
            </Space>
        </div>
    )
}

export default ValuesArrayField
