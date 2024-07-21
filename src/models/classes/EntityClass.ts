import {Moment} from "moment";
import {nowDate} from "../../utils/dateUtils";
import {EntityAttrClass} from "../../models/classes/EntityAttrClass";
import {EntityTagClass} from "../../models/classes/EntityTagClass";
import {EntityAttrValTypesEnum} from "../../constants/EntityAttrValTypes";
import {FormConfigFormsType} from "../../models/types/FormConfigFormsType";
import {FormConfigComponentType} from "../../models/types/FormConfigComponentType";

/**
 * Класс сущности
 */
export class EntityClass {
  id?: string;
  modelId: string;
  name: string;
  descr: string;
  code: string;
  created: Moment;
  categoryId: string;
  primary_key?: string;
  pk_value_type?: EntityAttrValTypesEnum
  attrs: EntityAttrClass[]
  tags: EntityTagClass[]
  config?: {
    gridConfig: {       // конфиг грида
      uncut?: boolean   // флаг переноса текста в колонках грида
      limit?: number    // ограничение сверху на размер текста в колонках грида
      tree?: boolean    // флаг дверовидного грида
      entities?: {      // сущности, которые могут отображаться в гриде (только для дерева)
        attr: string    // код атрибута связи (ключа)
        code: string    // код сущности
      }[]
    },
    formConfig?: {      // кастомные формы
      forms: FormConfigFormsType[]             // конструктор форм сущности
      components: FormConfigComponentType[]    // конструктор форм сбора
    }
  }

  constructor(modelId: string) {
    this.modelId = modelId
    this.name = ''
    this.descr = ''
    this.code = ''
    this.categoryId = ''
    this.created = nowDate()
    this.attrs = [] as EntityAttrClass[]
    this.tags = [] as EntityTagClass[]
  }
}
