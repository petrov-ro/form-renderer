import React from 'react';
import {Form} from 'antd';
import {Button, Icons, Spin, Collapse} from "@gp-frontend-lib/ui-kit-5";
import {FormConfigComponentType} from "../../../../models/types/FormConfigComponentType";
import {FormConfigComponentTypeEnum} from "../../../../constants/FormConfigComponentTypeEnum";
import {FormFieldProps} from "../../../../models/types/FormFieldProps";
import FormContentRenderer from "../../../FormContentRenderer/FormContentRenderer";
import {toArray} from "../../../../utils/arrayUtils";

const PlusOutlined = Icons.Add
const CaretRightOutlined = Icons.Dropdown
const DeleteOutlined = Icons.Delete

export type RefGridType<T = any> = FormFieldProps<T> & {
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
        name: initialName, loading, multivalued, formConfigComponents = []
    } = props

    // получение формы (компонента формы сбора) для сущности на которую ссылается объект (если такая форма есть - она будет отрисована, иначе - грид)
    const embeddedForm = formConfigComponents.find((f: FormConfigComponentType) => f.type === FormConfigComponentTypeEnum.EMBEDDED_FORM)

    const name = initialName ? toArray(initialName) : initialName

    return (
        <Spin spinning={false}>
            {embeddedForm && name &&
            <>
                {!multivalued &&
                <FormContentRenderer name={name}
                                     elements={embeddedForm?.config?.elements}
                />
                }

                {multivalued &&
                <>
                    <Form.List name={name}>
                        {(fields, {add, remove}) => (
                            <>
                                <div style={{display: 'flex', rowGap: 16, flexDirection: 'column'}}>
                                    {fields.map((field, i) => (
                                        <div style={{paddingBottom: 10}} key={field.key}>
                                            <Collapse
                                                bordered={false}
                                                defaultActiveKey={['1']}
                                                expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                                                items={[
                                                    {
                                                        key: '1',
                                                        label: `Запись ${i + 1}`,
                                                        children: <FormContentRenderer name={field.name}
                                                                                       elements={embeddedForm?.config?.elements}
                                                        />,
                                                    }
                                                ]}
                                            />

                                            <Button type="primary" danger onClick={() => remove(field.name)}
                                                    style={{marginLeft: 10}}>
                                                <DeleteOutlined/>
                                                Удалить {`запись ${i + 1}`}
                                            </Button>
                                        </div>
                                    ))}
                                </div>


                                <Button type="primary" style={{marginLeft: 10}} onClick={() => add()}>
                                    <PlusOutlined/>
                                    Добавить запись
                                </Button>
                            </>
                        )}
                    </Form.List>
                </>
                }
            </>
            }
        </Spin>
    )
}

export default ObjectByForm
