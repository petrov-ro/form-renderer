import {newOptionData} from "@/utils/optionDataHelper";

// типы компонентов для сущности (вкладка Компоненты форм сбора)
export enum FormConfigComponentTypeEnum {EMBEDDED_FORM = 'EMBEDDED_FORM'}

export const FormConfigComponentTypeDict = [
  newOptionData(FormConfigComponentTypeEnum.EMBEDDED_FORM, 'Вложенная форма')
]
