import {EntityAttrTypes} from "../../constants/EntityAttrTypes";
import {EntityAttrValTypesEnum} from "../../constants/EntityAttrValTypes";

/**
 * Класс индикатора формы сбора
 */
export class StatisticsIndicatorClass {
  name: string                      // отображаемое название поля
  code: string                      // уникальный код поля
  description: string               // описание поля, отображается в виде подсзказки

  entityAttr?: boolean              // показатель является атрибутом сущности
  id?: string                       // идентификатор из таблицы показателей форм сбора или атрибутов сущностей
  entity?: string                   // код сущности для показателя ссылочного типа не являющегося атрибутом сущности
  typeId?: EntityAttrTypes
  valueTypeId?: EntityAttrValTypesEnum
  config?: Record<string, any>      // описание формы отображения объекта (используется при преобразовании из старого формата в новый для формируемых объектов, у которых нет ссылки на реальную сущность)

  constructor(name = '', code = '', description = '', id = '', entityAttr = false, config?: Record<string, any>) {
    this.name = name
    this.code = code
    this.description = description
    this.id = id
    this.entityAttr = entityAttr
    this.config = config
  }
}
