import {FormInstance} from "antd"
import {FormConfigFormTypeEnum} from "../../constants/FormConfigFormTypeEnum";

export type EntityFormFormConfigType = {
  form?: FormInstance;
  disabled: boolean;
  isActual?: boolean
  isDraft?: boolean
  modelId?: string
}

/**
 * Вкладка кастомной формы сущности
 */
export type FormConfigFormsTabType = {
  id: string          // айди таба
  name: string        // наименование таба
  ordNum: number      // номер таба
  attrs?: string[]     // коды атрибутов
}

/**
 * Кастомная форма сущности
 */
export type FormConfigFormsType = {
  id: string                      // айди формы
  type: FormConfigFormTypeEnum    // тип формы
  enabled: boolean                // флаг что форма включена
  tabs: FormConfigFormsTabType[]  // массив табов
}
