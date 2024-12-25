import React, {PropsWithChildren} from "react";
import cn from 'classnames'
import {Col, Form, Row, Switch, Tree} from "antd";
import {Rule, RuleObject} from "antd/es/form";
import {
    Spin,
    TreeSelect,
    Upload
} from "@gp-frontend-lib/ui-kit-5";
import {DatePicker, Checkbox, Input, InputNumber, Radio, Select} from "@gp-frontend-ui/ui-kit-5v2";
import {TimePicker} from 'antd';
import {warning} from "@/utils/messages";
import {FormItemTypes} from "../../constants/FormItemTypes";
import {API, DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT} from "../../constants/Constants";
import {FormFieldProps} from "../../models/types/FormFieldProps";
import UUIDField from "../../components/FormField/Fields/UUIDField/UUIDField";
import ValuesArrayField from "./Fields/ValuesArrayField/ValuesArrayField";
import ObjectByForm from "../../components/FormField/Fields/ObjectByForm/ObjectByForm";
import './FormField.scss'

/**
 *  Соответствие тип - компонент, каждому типу должен быть сопоставлен компонент
 */
export const fields: any = {
    [FormItemTypes.text]: Input,
    [FormItemTypes.select]: Select,
    [FormItemTypes.checkbox]: Checkbox,
    [FormItemTypes.checkboxGroup]: Checkbox.Group,
    [FormItemTypes.radio]: Radio.Group,
    [FormItemTypes.number]: InputNumber,
    [FormItemTypes.integer]: InputNumber,
    [FormItemTypes.datetime]: DatePicker,
    [FormItemTypes.date]: DatePicker,
    [FormItemTypes.time]: TimePicker,
    [FormItemTypes.switch]: Switch,
    [FormItemTypes.area]: Input.Textarea,
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
const FormItem = React.forwardRef(
    (props: FormFieldProps & { inputType: FormItemTypes }, ref): JSX.Element => {
        const {
            inputType, name, label, styleLabel, fieldProps, children, className, rules = [], valueTypeBasic,
            ...formItemProps
        } = props;
        const CustomElement = (inputType === FormItemTypes.custom ? children : fields[inputType]) as React.ElementType

        // удаление свойств для всех, кроме указанных в массиве
        if (![FormItemTypes.custom].includes(inputType)) {
            delete formItemProps.currentElement
        }

        // добавление свойств для некоторых компонентов
        const elementProps: Record<string, any> = {}
        if ([FormItemTypes.custom, FormItemTypes.values].includes(inputType)) {
            elementProps.valueTypeBasic = valueTypeBasic
        }

        // модификация правил, добавление проверки ФЛК
        const rulesModified = [
            ...rules,
            (({getFieldsValue}) => {
                return ({
                    validator() {
                        try {
                            // подготовка данных для вызова проверок
                            const formData = getFieldsValue(true)       // полные данные формы
                            const requisiteKeys = name                  // получение имени конечного реквизита
                                .slice(-1)
                                .map(Number)

                            // выполнение проверки FLC
                            const result: CheckResult<RuleResultFlc> = API.checkFLC(requisiteKeys, formData)
                            const {rulesResult = []} = result

                            // возврат ошибок, если они есть
                            if (rulesResult.length > 0) {
                                return Promise.reject(rulesResult.map(res => new Error(res.errorMessage)));
                            }
                        } catch (err) {
                            console.log(err)
                            warning('Ошибка при выполнении проверки ФЛК');
                        }

                        return Promise.resolve();
                    },
                    validateDebounce: 500
                })
            }) as Rule
        ]

        /**
         * Значение undefined преобразуется к null для сервиса ФЛК
         * @param value
         */
        const normalize = (value: any) => value === undefined ? null : value

        return (
            <Form.Item name={name} className={className} style={styleLabel} rules={rulesModified}
                       layout={'horizontal'} normalize={normalize} {...formItemProps}>
                <CustomElement ref={ref} {...fieldProps} label={label} {...elementProps}/>
            </Form.Item>
        )
    }
)

/**
 * Атрибут формы
 *
 */
const FormField = React.forwardRef(
    (props: PropsWithChildren<FormFieldProps>, ref): JSX.Element => {
        const {
            name, field, inputType = FormItemTypes.text, disabled, readOnly, placeholder = '', loading = false,
            inline, inlineVertical, label: labelText, tooltip,
            span = 24, xs, sm, md, lg, xl, xxl, flex, visibleLabelCol = true, fieldProps,
            ...restProps
        } = props;

        // название поля
        const label = labelText

        // имя поля
        const namePath = field ? [field.name, name].flat() : name

        // свойства компоненты
        const mainProps = {
            ...restProps, disabled, readOnly, placeholder, label,
            name: namePath,
        }

        // доп свойства общее
        const {max_value, min_value, max_length, precision, mask} = restProps.currentElement?.indicator?.config || {}
        const addProps: any = {
            fieldProps: {
                ...fieldProps
            }
        }

        // доп свойства в зависимости от типа поля
        switch (inputType.toString()) {
            case FormItemTypes.values.toString():
                // для этого компонента передаются все свойства
                addProps.fieldProps = {
                    ...addProps.fieldProps,
                    maxLength: max_length,
                    precision: precision ?? undefined,
                    max: max_value ?? undefined,
                    min: min_value ?? undefined,
                }
                break;
            case FormItemTypes.text.toString():
                addProps.fieldProps = {
                    ...addProps.fieldProps,
                    maxLength: max_length,
                }
                break;
            case FormItemTypes.select.toString():
                addProps.fieldProps = {
                    ...addProps.fieldProps,
                    showSearch: true,
                    minDate: API.minDate,
                    maxDate: API.maxDate
                }
                break;
            case FormItemTypes.date.toString():
                addProps.fieldProps!.format = DATE_FORMAT
                addProps.fieldProps = {
                    ...addProps.fieldProps,
                    showTime: false,
                    minDate: API.minDate,
                    maxDate: API.maxDate
                }
                break;
            case FormItemTypes.time.toString():
                let formatTime = TIME_FORMAT
                if (mask === "HH:mm") {
                    formatTime = mask
                }
                addProps.fieldProps!.format = formatTime
                addProps.fieldProps = {
                    ...addProps.fieldProps,
                    minDate: API.minDate,
                    maxDate: API.maxDate
                }
                break;
            case FormItemTypes.datetime.toString():
                let format = DATE_TIME_FORMAT
                if (mask === "dd.MM.yyyy HH:mm") {
                    format = "DD.MM.YYYY HH:mm"
                }
                addProps.fieldProps!.format = format
                addProps.fieldProps = {
                    ...addProps.fieldProps,
                    showTime: true,
                    minDate: API.minDate,
                    maxDate: API.maxDate
                }
                break;
            case FormItemTypes.area.toString():
                addProps.fieldProps = {
                    ...addProps.fieldProps,
                    minDate: API.minDate,
                    maxDate: API.maxDate
                }
                break;
            case FormItemTypes.checkbox.toString():
                addProps.valuePropName = 'checked'
                break;
            case FormItemTypes.switch.toString():
                break;
            case FormItemTypes.integer.toString():
                addProps.fieldProps = {
                    ...addProps.fieldProps,
                    max: max_value ?? undefined,
                    min: min_value ?? undefined,
                }
                break;
            case FormItemTypes.number.toString():
                addProps.fieldProps = {
                    ...addProps.fieldProps,
                    precision: precision ?? undefined,
                    max: max_value ?? undefined,
                    min: min_value ?? undefined,
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
                span={span} xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl} flex={flex}
            >
                <div className={cn('form-item-container', {'input-disabled-container': disabled})}>
                    <Row>
                        {visibleLabelCol &&
                        <Col xs={12} lg={6} style={{textAlign: 'left'}}>
                            {label}
                        </Col>
                        }

                        <Col xs={12} lg={18} style={{textAlign: 'left'}}
                             className='data-col'>
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

export default FormField
