import React, {forwardRef, ReactElement} from "react";
import {Provider} from 'react-redux'
import {StatisticsFormConfig} from "../../models/classes/StatisticsFormConfig";
import {ClassicFormClass} from "../../models/classes/ClassicFormElementClass";
import store from "../../redux/store/index";
import FormRendererStored from "./FormRendererStored/FormRendererStored";
import {flcCheck} from "../../services/FLCService";

export interface ButtonType {
    text: string,
    icon: ReactElement,
    action: (values: Record<string, any>) => void
}

export interface CheckResultType {
    errors: {
        type: number
    }[],
    warnings: {
        type: number
    }[],
}

export interface FormRendererProps {
    fetch: (url: string, params: Record<string, any>) => Promise<Response>   // метод для вызова запросов
    apiPath: string                                             // адрес для вызова процедур
    flcPath?: string                                            // адрес для вызова методов ФЛК
    config?: StatisticsFormConfig | ClassicFormClass            // конфиг (метаданные) формы
    edit?: boolean                                              // режим редактирования
    data?: Record<string, any>                                  // данные для отображения на форме
    setData?: (fieldData: any,                                  // колбек при установке новых значений формы
               fullData: Record<string, any>) => void
    noEmpty?: boolean                                           // не включать пустые значения в возвращаемые данные
    extraButtons?: ButtonType[]                                 // дополнительные кнопки
    checkButton?: boolean                                       // флаг отображения кнопки проверки
    legacy?: boolean                                            // старый формат конфига
    dictDate?: string                                           // дата на которую отображается состояние справочников (в формате YYYY-MM-DD)
    dictClosed?: boolean                                        // полказывать закрытые записи справочников
}

export interface refType {
    getData: () => Record<string, any>
    resetFields: () => void
    setFieldsValue: (newData: Record<string, any>) => void
    flcCheck: () => void                                        // проверка правил ФЛК и показ окна
}

/**
 * Компонент рендера формы по метаданным
 *
 * @param props
 * @constructor
 */
const FormRenderer = forwardRef<refType, FormRendererProps>((props, ref) => {
    return (
        <Provider store={store}>
            <FormRendererStored {...props} ref={ref}/>
        </Provider>
    )
}
)

export default React.memo(FormRenderer)
