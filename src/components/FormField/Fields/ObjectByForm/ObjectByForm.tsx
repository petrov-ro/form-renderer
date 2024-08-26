import React, {useState} from 'react';
import {Form} from 'antd';
import {Button, Collapse, Icons, Spin} from "@gp-frontend-lib/ui-kit-5";
import {toArray} from "../../../../utils/arrayUtils";
import {FormConfigComponentType} from "../../../../models/types/FormConfigComponentType";
import {FormConfigComponentTypeEnum} from "../../../../constants/FormConfigComponentTypeEnum";
import {FormFieldProps} from "../../../../models/types/FormFieldProps";
import SingleObjectByForm
    from "../../../../components/FormField/Fields/ObjectByForm/SingleObjectByForm/SingleObjectByForm";

const PlusOutlined = Icons.Add
const CaretRightOutlined = Icons.Dropdown
const DeleteOutlined = Icons.Delete

export type RefGridType<T = any> = Partial<FormFieldProps<T>> & {
    multivalued?: boolean   // флаг возможности множественного выбора
    label: string           // наименование сущности
    code: string            // код сущности для отображения записей
    disabled?: boolean      // отключить редактирование
    loading?: boolean
    dataSource?: any[]
    addBtnText?: string
    versionColumn?: boolean
    exclude?: string[]                      // массив системных идентификторов, которые нельзя выбрать в гриде
    setFormData: (values: any) => void      // изменение значений формы
}

type FormAttributeObjectProps = Partial<RefGridType<Record<string, any> | Record<string, any>[]>> & {
    formConfigComponents?: FormConfigComponentType[]
}

/**
 * Компонент вывода атрибута типа Объект на форму записи (значение может быть объектом или массивом объектов)
 *
 * @param props
 * @constructor
 */
const ObjectByForm: React.FC<FormAttributeObjectProps> = props => {
    const {
        loading, multivalued, formConfigComponents = [],
        name, setFormData
    } = props

    const form = Form.useFormInstance();

    const [deleted, setDeleted] = useState(0)

    // получение формы (компонента формы сбора) для сущности на которую ссылается объект (если такая форма есть - она будет отрисована, иначе - грид)
    const embeddedForm = formConfigComponents.find((f: FormConfigComponentType) => f.type === FormConfigComponentTypeEnum.EMBEDDED_FORM)

    /**
     * Возвращает значение текущего атрибута
     */
    const getValue = () => {
        return form?.getFieldValue(name)
    }

    /**
     * Изменение значения в массиве
     * @param index - индекс записи в массиве
     */
    const setValue = (newValue: Record<string, any>) => {
        if (name && typeof name === 'string') {
            setFormData?.({[name]: newValue})
        }
    }

    /**
     * Изменение значения в массиве
     * @param index - индекс записи в массиве
     */
    const onChangeVal = (index: number) => (newVal: Record<string, any>) => {
        const newValue = (getValue() || []).map((val: Record<string, any>, i: number) => i === index ? newVal : val)
        setValue(newValue)
    }

    /**
     * Изменение одиночного значения
     */
    const onChangeSingle = (newVal: Record<string, any>) => {
        setValue(newVal)
    }

    /**
     * Добавление нового значения
     */
    const addNewValue = () => {
        let newValue
        if (multivalued) {
            newValue = toArray(getValue() || []).concat([{}])
        } else {
            newValue = {}
        }
        setValue(newValue)
    }

    /**
     * Удаление значения
     */
    const removeValue = (index: number) => () => {
        let newValue
        if (multivalued) {
            newValue = toArray(getValue() || [])
            newValue.splice(index, 1);
        } else {
            newValue = {}
        }
        setValue(newValue)
        setDeleted(deleted + 1)
    }

    return (
        <Spin spinning={false}>
            {embeddedForm &&
            <>
                {!multivalued &&
                <SingleObjectByForm value={getValue()} onChange={onChangeSingle} config={embeddedForm?.config}/>
                }

                {multivalued &&
                <>
                    {
                        toArray(getValue())
                            .map((v: Record<string, any>, i: number) =>
                                <div style={{paddingBottom: 10}} key={i.toString() + '-' + deleted.toString()}>
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={['1']}
                                        expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                                        items={[
                                            {
                                                key: '1',
                                                label: `Запись ${i + 1}`,
                                                children: <SingleObjectByForm value={v} onChange={onChangeVal(i)}
                                                                              config={embeddedForm?.config}/>,
                                            }
                                        ]}
                                    />


                                    <Button type="primary" danger onClick={removeValue(i)} style={{marginLeft: 10}}>
                                        <DeleteOutlined/>
                                        Удалить {`запись ${i + 1}`}
                                    </Button>
                                </div>
                            )
                    }
                    <Button type="primary" style={{marginLeft: 10}} onClick={addNewValue}>
                        <PlusOutlined/>
                        Добавить запись
                    </Button>
                </>
                }
            </>
            }
        </Spin>
    )
}

export default ObjectByForm
