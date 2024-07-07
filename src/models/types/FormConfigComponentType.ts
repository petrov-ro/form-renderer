import {FormConfigComponentTypeEnum} from "../../constants/FormConfigComponentTypeEnum";
import {StatisticsFormConfig} from "../classes/StatisticsFormConfig";

/**
 * Кастомная форма (запись вкладки Компоненты форм сбора)
 */
export type FormConfigComponentType = {
    id: string                            // айди формы
    name: string                          // наименование формы
    type: FormConfigComponentTypeEnum     // тип формы
    enabled: boolean                      // флаг что форма включена
    config: StatisticsFormConfig          // конфиг формы сбора
}
