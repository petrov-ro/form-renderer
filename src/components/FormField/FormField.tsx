import React, {PropsWithChildren, ReactNode} from "react";
import cn from 'classnames'
import {
    Checkbox,
    Col, DatePicker,
    Form, Input, InputNumber, Radio, Row, Select, Space,
    Spin, Switch,
    Tree,
    TreeSelect,
    Upload
} from "antd";
import {FormItemTypes} from "../../constants/FormItemTypes";
import {DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT} from "../../constants/Constants";
import {FormFieldProps} from "../../models/types/FormFieldProps";
import UUIDField from "../../components/FormField/Fields/UUIDField/UUIDField";
import ValuesArrayField from "./Fields/ValuesArrayField/ValuesArrayField";
import ObjectByForm from "../../components/FormField/Fields/ObjectByForm/ObjectByForm";
import './FormField.scss'

/**
 *  Соответствие тип - компонент, каждому типу должен быть сопоставлен компонент
 */
const fields: any = {
    [FormItemTypes.text]: Input,
    [FormItemTypes.select]: Select,
    [FormItemTypes.checkbox]: Checkbox,
    [FormItemTypes.checkboxGroup]: Checkbox.Group,
    [FormItemTypes.radio]: Radio.Group,
    [FormItemTypes.number]: InputNumber,
    [FormItemTypes.integer]: InputNumber,
    [FormItemTypes.datetime]: DatePicker,
    [FormItemTypes.date]: DatePicker,
    [FormItemTypes.time]: DatePicker,
    [FormItemTypes.switch]: Switch,
    [FormItemTypes.area]: Input.TextArea,
    [FormItemTypes.uuid]: UUIDField,
    [FormItemTypes.object]: ObjectByForm,
    [FormItemTypes.tree]: Tree,
    [FormItemTypes.treeSelect]: TreeSelect,
    [FormItemTypes.file]: Upload,
    [FormItemTypes.values]: ValuesArrayField
}

/**
 * Обертка атрибута формы
 *
 * @param props
 * @constructor
 */
const FormItem = (props: FormFieldProps & { inputType: FormItemTypes }): JSX.Element => {
    const {
        inputType, name, label, styleLabel, fieldProps, children, className, rules, ...childrenProps
    } = props;
    const CustomElement = (inputType === FormItemTypes.custom ? children : fields[inputType]) as React.ElementType

    return (
        <Form.Item name={name} className={className} style={styleLabel} rules={rules} layout={'horizontal'}>
            <CustomElement {...childrenProps} {...fieldProps} label={label}/>
        </Form.Item>
    )
}

/**
 * Атрибут формы
 *
 */
const FormField = React.forwardRef(
    (props: PropsWithChildren<FormFieldProps>, ref): JSX.Element => {
        const {
            name, field, inputType = FormItemTypes.text, disabled, readonly, placeholder = '', loading = false,
            inline, inlineVertical, label: labelText, tooltip,
            span = 24, xs, sm, md, lg, xl, xxl, flex,
            ...restProps
        } = props;

        // console.log(props)

        // название поля
        const label = labelText

        // свойства компоненты
        const mainProps = {
            ...restProps, disabled, readonly, placeholder, label,
            name: field ? [field.name, name].flat() : name,
        }

        // доп свойства общее
        const addProps: any = {
            fieldProps: {
                ...props.fieldProps
            }
        }

        // доп свойства в зависимости от типа поля
        switch (inputType.toString()) {
            case FormItemTypes.select.toString():
                addProps.fieldProps!.showSearch = true
                break;
            case FormItemTypes.date.toString():
                addProps.fieldProps!.format = DATE_FORMAT
                break;
            case FormItemTypes.time.toString():
                addProps.fieldProps!.format = TIME_FORMAT
                break;
            case FormItemTypes.datetime.toString():
                addProps.fieldProps!.format = DATE_TIME_FORMAT
                break;
            case FormItemTypes.checkbox.toString():
                addProps.valuePropName = 'checked'
                break;
            case FormItemTypes.switch.toString():
                break;
            case FormItemTypes.integer.toString():
                addProps.fieldProps = {
                    ...addProps.fieldProps,
                    precision: 0
                }
                break;
            case FormItemTypes.uuid.toString():
                mainProps.rules = [
                    ...(mainProps.rules || []),
                    {
                        pattern: new RegExp('^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$'),
                        message: `Значение не соответствует шаблону XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`
                    }
                ]
                break;
            default:
        }

        return (
            <Col
                className={cn('gutter-row', 'form-item', {'inline-field': inline}, {'inline-vertical-field': inlineVertical})}
                span={span} xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl} flex={flex}>
                <div className={cn({'input-disabled-container': disabled})}>
                    <Row>
                        <Col xs={12} lg={6} style={{textAlign: 'left', paddingTop: 10, paddingBottom: 10}}>
                            {label}
                        </Col>

                        <Col xs={12} lg={18} style={{textAlign: 'left', paddingTop: 10, paddingBottom: 10}} className='data-col'>
                            <Spin spinning={loading}>
                                <FormItem {...mainProps} {...addProps} ref={ref} inputType={inputType}/>
                            </Spin>
                        </Col>
                    </Row>
                </div>
            </Col>
        );
    }
)

export default React.memo(FormField)
