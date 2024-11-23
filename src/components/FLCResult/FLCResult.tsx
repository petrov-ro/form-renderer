import {FC, useEffect, useMemo, useState} from "react";
import {Button, FormInstance} from "antd";
import styled from 'styled-components';
import {CloseOutlined, ReloadOutlined} from '@ant-design/icons';
import {NamePath} from "antd/es/form/interface";
import {API, CODE} from "../../constants/Constants";
import {ClassicFormClass} from "../..";
import {capitalize} from "../../utils/stringHelper";
import {errorHandle} from "../../utils/messages";

type FLCResultProps = {
    form: FormInstance
    config: ClassicFormClass
    onClose: () => void
    container: HTMLElement
    containerOverflow: string
}

/**
 * Компонент ошибки на форме с результатом проверки
 */
const ErrorContainer = styled.div`
    margin: 0 5px 5px 0;
    cursor: pointer;
    -webkit-transition: background-color 200ms linear,
                        box-shadow 200ms linear;
    -ms-transition: background-color 200ms linear,
                    box-shadow 200ms linear;
    transition: background-color 200ms linear,
                box-shadow 200ms linear;

    &:hover {
        background-color: #ff7c4520;
        box-shadow: 0px 0px 2px 5px #ff7c4520;
  }
`;

/**
 * Компонент модального окна c результатом проверки ФЛК всей формы
 *
 * @param props
 * @constructor
 */
const FLCResult: FC<FLCResultProps> = (props) => {
    const {form, config, onClose, container, containerOverflow} = props

    const [errors, setErrors] = useState<RuleResultFlc[]>([])

    // получение ключа формы
    const {t_600000018: requisites = []} = config as ClassicFormClass

    // массив всех реквизитов формы
    const requisiteMap = useMemo(() => {
        return (
            requisites
                .filter(req => req.is_visible)
                .reduce((acc, req) => {
                    const reqKey = `${req[CODE] ? `${req[CODE]}. ` : ''} ${capitalize(req.name)}`
                    const reqIdKey = req.req_id?.key
                    if (reqIdKey) {
                        acc[reqIdKey] = reqKey
                    }
                    return acc
                }, {} as Record<number, string>)
        )
    }, [])

    // проверка ФЛК
    const check = () => {
        form.validateFields()
            .then((res: {name: NamePath, errors: string[], warnings: string[]}) => {
                // console.log(res)
            })
            .catch(err => {
                errorHandle(err)
            })

        // массив ключей всех реквизитов формы
        const requisiteIdKeys = Object.keys(requisiteMap).map(Number)

        // получение полных данных формы
        const formData = form.getFieldsValue(true)

        // выполнение проверки
        const result: CheckResult<RuleResultFlc> = API.checkFLC(requisiteIdKeys, formData)
        const {rulesResult = []} = result

        // возврат ошибок, если они есть
        if (rulesResult.length > 0) {
            setErrors(rulesResult)
        }
    }

    useEffect(() => {
        // возвращается скролл контейнеру
        container.style.overflow = 'auto'

        return () => {
            container.style.overflow = containerOverflow
        }
    }, [])

    useEffect(() => {
        // выполняется проверка при открытии окна
        check()
    })

    /**
     * Клик по ошибке в окне результатов
     * @param e
     */
    const onClick = (e: React.MouseEvent<HTMLElement>, error: RuleResultFlc) => {
        e.preventDefault()
        e.stopPropagation()

        // формирование цепочки имени реквизита
        const {requisiteKey, groupNumber, parentsChain} = error
        const namePath: any[] = parentsChain
            .flatMap(({groupNumber, requisiteKey}) => (
                groupNumber !== null && groupNumber !== undefined ? [requisiteKey, groupNumber] : requisiteKey
            ))
            .reverse()
        if (groupNumber !== null && groupNumber !== undefined) {
            namePath.push(groupNumber)
        }
        namePath.push(requisiteKey)

        // переход к реквизиту
        form.focusField(namePath)
        form.scrollToField(namePath)
    }

    return (
        <>
            <div style={{width: '100%'}} onMouseDown={e => {e.stopPropagation();}}>
                {errors.map((error, index) => {
                        const {requisiteKey, ruleData, errorMessage} = error
                        return (
                            <ErrorContainer
                                key={`${requisiteKey}-${ruleData.ruleKey}`}
                                onClick={e => onClick(e, error)}
                            >
                                <p>
                                    <span style={{fontWeight: 500}}>{index + 1}. {requisiteMap[requisiteKey]}</span>
                                    <br/>
                                    {errorMessage}
                                </p>
                            </ErrorContainer>
                        )
                    }
                )}

                {errors.length === 0 &&
                <p>
                    <span style={{fontWeight: 500}}>Ошибок нет</span>
                </p>
                }
            </div>

            <Button type='text'
                    style={{
                        position: 'absolute',
                        top: 12,
                        insetInlineEnd: 48,
                        width: 32,
                        height: 32,
                        zIndex: 1010,
                        padding: 0,
                        color: 'rgba(0, 0, 0)',
                        fontWeight: 600,
                        lineHeight: 1,
                        textDecoration: 'none',
                        borderRadius: 4,
                        border: 0,
                        outline: 0,
                        cursor: 'pointer',
                        transition: 'color 0.2s, background-color 0.2s'
                    }}
                    title='Обновить'

                    onClick={() => check()}
                    onMouseDown={e => e.stopPropagation()}
            >
                <ReloadOutlined/>
            </Button>

            <Button type='text'
                    style={{
                        position: 'absolute',
                        top: 12,
                        insetInlineEnd: 12,
                        width: 32,
                        height: 32,
                        zIndex: 1010,
                        padding: 0,
                        color: 'rgba(0, 0, 0)',
                        fontWeight: 600,
                        lineHeight: 1,
                        textDecoration: 'none',
                        borderRadius: 4,
                        border: 0,
                        outline: 0,
                        cursor: 'pointer',
                        transition: 'color 0.2s, background-color 0.2s'
                    }}
                    onClick={onClose}
                    onMouseDown={e => e.stopPropagation()}
                    title='Закрыть'
            >
                <CloseOutlined/>
            </Button>
        </>
    )
}

export default FLCResult
