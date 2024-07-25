import React, {ReactElement} from "react";
import {Provider} from 'react-redux'
import {StatisticsFormConfig} from "../../models/classes/StatisticsFormConfig";
import {ClassicFormClass} from "../../models/classes/ClassicFormElementClass";
import store from "../../redux/store/index";
import FormRendererStored from "./FormRendererStored/FormRendererStored";

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
    fetch: (url: string, params: Record<string, any>) => Promise<Response>   // адрес для вызова процедур
    apiPath: string                                             // адрес для вызова процедур
    config?: StatisticsFormConfig | ClassicFormClass            // конфиг (метаданные) формы
    edit?: boolean                                              // режим редактирования
    data?: Record<string, any>                                  // данные для отображения на форме
    checkHandle?: (data: Record<string, any>,
                   result: CheckResultType) => void             // колбек при проверке данных
    setData?: (data: string) => void                            // колбек при установке новых значений формы
    extraButtons?: ButtonType[]                                 // дополнительные кнопки
    checkButton?: boolean                                       // флаг отображения кнопки проверки
    legacy?: boolean                                            // старый формат конфига
}

/**
 * Компонент рендера формы по метаданным
 *
 * @param props
 * @constructor
 */
const FormRenderer: React.FC<FormRendererProps> = props => {
    return (
        <Provider store={store}>
            <FormRendererStored {...props}/>
        </Provider>
    )
}

export default React.memo(FormRenderer)
