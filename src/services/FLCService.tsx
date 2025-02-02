/**
 * Сервисы форматно-логического контроля форм
 */
import Draggable from 'react-draggable';
import {getJSONRaw} from "./AbstractService";
import {API} from "@/constants/Constants";
import {Button} from '@gp-frontend-lib/ui-kit-5';
import {FLCLocationEnum} from "@/constants/FLCLocationEnum";
import {FLCRuleTypeEnum} from "@/constants/FLCRuleTypeEnum";
import {FormInstance, Modal} from "antd";
import FLCResult from "../components/FLCResult/FLCResult";
import {ClassicFormClass} from "..";

/**
 * Запрос пакета правил
 *
 * @param formVersionId   - ключ версии формы
 * @param location        - справочник локаций
 * @param type            - вид правил ФЛК
 * @param requisiteKeys   - ключи реквизитов, для которых нужно выбрать связанные с ними правила ФЛК
 * @param multiForm       - флаг, обозначающий, что при выполнении правил ФЛК нужно включить/исключить правила с признаком межформенности.
 * @param debugOutput     - флаг, включающий дополнительный вывод информации для отладки. Например, в вывод результата выполнения правила добавится дополнительная информация с данными правила.
 */
export const getFLCPackage = (formVersionId: number,
                              location: FLCLocationEnum,
                              type: FLCRuleTypeEnum,
                              requisiteKeys: any[] = [],
                              multiForm: boolean = false,
                              debugOutput: boolean = true
) => {
    // парметры get-запроса
    const urlParams = new URLSearchParams({
        formVersionId: formVersionId.toString(),
        location: location.toString(),
        type: type.toString(),
        jsMinEnabled: 'false'
    }).toString()

    // формирование адреса
    const url = `${API.REACT_APP_API_FLC_URL}/flc/package/get?${urlParams}`

    return getJSONRaw(url)
}

/**
 * Выполнение проверки ФЛК и отображение окна результатов
 */
export const flcCheckResult = (form: FormInstance, validateOnly = true): Promise<boolean> =>
    form.validateFields({validateOnly})
        .then(() => true)
        .catch(() => false)

/**
 * Выполнение проверки ФЛК и отображение окна результатов
 */
export const flcCheck = (form: FormInstance, config: ClassicFormClass, checkResult: CheckResult): {destroy: (() => void)} => {
    const container = document.body
    const containerOverflow = container?.style?.overflow

    // предварительно закрывается открытое ранее окно (если оно есть)
    API.modal?.destroy()

    const instance = Modal.warning({
        title: 'Ошибки',
        content: (
            <FLCResult form={form} config={config} onClose={() => instance.destroy()}
                       container={container} containerOverflow={containerOverflow} checkResult={checkResult}/>
        ),
        mask: false,
        closable: false,
        getContainer: container,
        modalRender: (modal) => (
            <Draggable
                disabled={false}
            >
                <div>{modal}</div>
            </Draggable>
        ),
        styles: {
            wrapper: {
                pointerEvents: 'none'
            },
            body: {
                maxHeight: '70vh',
                minWidth: '10%',
                overflow: 'auto'
            }
        },
        style: {top: 50, float: 'right', marginRight: 50},
        footer: [
            <Button key="back"
                    style={{width: 'calc(100% - 34px)', marginLeft: 34, marginTop: 10}}
                    onClick={() => {
                        instance.destroy()
                    }}
                    onMouseDown={e => e.stopPropagation()}
            >
                Назад
            </Button>
        ]
    })

    API.modal = instance

    return instance
}

/**
 * Скрытие элементов формы
 *
 * @param hiding    - список путей ранее скрытых
 * @param hidePaths - список путей которые нужно скрыть
 */
export const hide = (hiding, hidePaths) => {
    // открыть тех, кто есть в ранее скрытых, но нет в новых скрытых
    hiding
        .filter((h: string) => !hidePaths.includes(h))
        .forEach((id: string) => {
            // открыть
            const item = document.getElementById(id)
            if (item) {
                item.style.visibility = 'visible'
                item.style.position = 'static'
            } else {
                console.log('Поле формы не найдено')
            }
        })

    // скрыть тех кого нет в уже скрытых
    hidePaths
        .filter((h: string) => !hiding.includes(h))
        .forEach((id: string) => {
            // скрыть
            const item = document.getElementById(id)
            if (item) {
                item.style.visibility = 'hidden'
                item.style.position = 'fixed'
            } else {
                console.log('Поле формы не найдено')
            }
        })

    // запись нового значения
    return [...hidePaths]
}

