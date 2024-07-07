import {EntityAttrTypes} from "../../constants/EntityAttrTypes";
import {EntityAttrValTypesEnum} from "../../constants/EntityAttrValTypes";
import {Moment} from "moment";

/**
 * Класс индикатора формы сбора
 */
export class StatisticsIndicatorClass {
  name: string
  code: string
  description: string

  entityAttr?: boolean              // показатель является атрибутом сущности
  id?: string                       // идентификатор из таблицы показателей форм сбора или атрибутов сущностей
  categoryId?: string
  config?: Record<string, any>
  created?: Moment
  entity?: string                   // код сущности для показателя ссылочного типа не являющимся атрибутом сущности
  modelId?: string
  typeId?: EntityAttrTypes
  valueTypeId?: EntityAttrValTypesEnum

  constructor(name = '', code = '', description = '', id = '', entityAttr = false) {
    this.name = name
    this.code = code
    this.description = description
    this.id = id
    this.entityAttr = entityAttr
  }
}
