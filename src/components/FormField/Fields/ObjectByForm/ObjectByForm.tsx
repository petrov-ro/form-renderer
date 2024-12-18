import React, { useContext } from 'react';
import {Form} from 'antd';
import {Button, Icons, Spin, Collapse} from "@gp-frontend-lib/ui-kit-5";
import {FormConfigComponentType} from "../../../../models/types/FormConfigComponentType";
import {FormConfigComponentTypeEnum} from "../../../../constants/FormConfigComponentTypeEnum";
import {FormFieldProps} from "../../../../models/types/FormFieldProps";
import FormContentRenderer from "../../../FormContentRenderer/FormContentRenderer";
import {isArray, toArray} from "../../../../utils/arrayUtils";
import {ConfigContext} from "../../../FormRenderer/FormRendererStored/FormRendererStored";
import {deepFind} from "../../../../utils/treeUtils";
import {isString} from "../../../../utils/common";

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

    const initialValues = useContext(ConfigContext);
    const find = deepFind(initialValues, name.filter(isString))
    const defaultValues = (isArray(find) && find.length > 0) ? find[0] : find

    return (
        <Spin spinning={false}>
            {embeddedForm && name &&
            <>
                {!multivalued &&
                <FormContentRenderer name={name} path={name}
                                     elements={embeddedForm?.config?.elements}
                />
                }

                {multivalued &&
                <Form.List name={name}>
                    {(fields, {add, remove}) => (
                        <>
                            <div style={{display: 'flex', rowGap: 16, flexDirection: 'column'}}>
                                {fields.map((field, i) => {
                                    const namePath = name === undefined ? [field.name] : (
                                        isArray(name) ? name.concat([field.name]) : toArray(name).concat([field.name])
                                    )

                                    return (
                                    <div style={{paddingBottom: 10}} key={field.key}>
                                        <Collapse
                                            bordered={false}
                                            defaultActiveKey={['1']}
                                            expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                                            items={[
                                                {
                                                    key: '1',
                                                    label: `Запись ${i + 1}`,
                                                    children: <FormContentRenderer name={field.name} path={namePath}
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
                                )})}
                            </div>

                            <Button type="primary" style={{marginLeft: 10}} onClick={() => add(defaultValues)}>
                                <PlusOutlined/>
                                Добавить запись
                            </Button>
                        </>
                    )}
                </Form.List>
                }
            </>
            }
        </Spin>
    )
}

export default ObjectByForm
