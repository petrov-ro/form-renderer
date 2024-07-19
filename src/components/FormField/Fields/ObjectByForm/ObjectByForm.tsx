import React, {useState} from 'react';
import {Button, Collapse, Spin} from 'antd';
import {CaretRightOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {toArray} from "../../../../utils/arrayUtils";
import {FormConfigComponentType} from "../../../../models/types/FormConfigComponentType";
import {FormConfigComponentTypeEnum} from "../../../../constants/FormConfigComponentTypeEnum";
import {EntityClass} from "../../../../models/classes/EntityClass";
import SingleObjectByForm
    from "../../../../components/FormField/Fields/ObjectByForm/SingleObjectByForm/SingleObjectByForm";
import {FormFieldProps} from "../../../../models/types/FormFieldProps";

const {Panel} = Collapse;

export type RefGridType<T = any> = Partial<FormFieldProps<T>> & {
    multivalued?: boolean   // флаг возможности множественного выбора
    label: string           // наименование сущности
    code: string            // код сущности для отображения записей
    disabled?: boolean      // отключить редактирование
    loading?: boolean
    dataSource?: any[]
    addBtnText?: string
    versionColumn?: boolean
    exclude?: string[]  // массив системных идентификторов, которые нельзя выбрать в гриде
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
        value: initialValue = multivalued ? [] : {}, form, name
    } = props

    const [value, setVal] = useState(initialValue)

    // получение формы (компонента формы сбора) для сущности на которую ссылается объект (если такая форма есть - она будет отрисована, иначе - грид)
    const embeddedForm = formConfigComponents.find((f: FormConfigComponentType) => f.type === FormConfigComponentTypeEnum.EMBEDDED_FORM)

    /**
     * Изменение значения в массиве
     * @param index - индекс записи в массиве
     */
    const setValue = (newValue: Record<string, any>) => {
        setVal(newValue)
        form?.setFieldValue(name, newValue)
    }

    /**
     * Изменение значения в массиве
     * @param index - индекс записи в массиве
     */
    const onChangeVal = (index: number) => (newVal: Record<string, any>) => {
        const newValue = value.map((val: Record<string, any>, i: number) => i === index ? newVal : val)
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
            newValue = toArray(value).concat([{}])
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
            newValue = toArray(value)
            newValue.splice(index, 1);
        } else {
            newValue = {}
        }
        setValue(newValue)
    }

    return (
        <Spin spinning={false}>
            {embeddedForm &&
            <>
                {!multivalued &&
                <SingleObjectByForm value={value} onChange={onChangeSingle} config={embeddedForm?.config}/>
                }

                {multivalued &&
                <>
                    {
                        toArray(value)
                            .map((v: Record<string, any>, i: number) =>
                                <div style={{paddingBottom: 10}} key={i}>
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={['1']}
                                        expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                                    >
                                        <Panel header={`Запись ${i + 1}`} key="1">
                                            <SingleObjectByForm value={v} onChange={onChangeVal(i)}
                                                                config={embeddedForm?.config}/>
                                        </Panel>
                                    </Collapse>

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
