import {Moment} from "moment";
import {uuid} from "../../utils/common";
import {nowDate} from "../../utils/dateUtils";
import {EntityAttrTypes} from "../../constants/EntityAttrTypes";
import {EntityAttrValTypesEnum} from "../../constants/EntityAttrValTypes";
import {EntityAttrCalcArgument} from "../../models/types/EntityAttrCalcArgument";

export class EntityAttrClass {
  id?: string
  tempId?: string           // временное поле для присвоения уникального идентификатора новым атрибутам
  ordNum: number
  name: string
  descr: string             // используется также как текст подсказки
  code: string
  created: Moment
  primaryKey: boolean
  multivalued: boolean
  required: boolean
  search: boolean
  ftSearch: boolean
  uniq: boolean
  typeId?: EntityAttrTypes
  valueTypeId?: EntityAttrValTypesEnum
  config: {
    validateConfig: {
      pattern?: string          // шаблон строки для текстового поля
      checkOrtho?: boolean
      checkMorpho?: boolean
      checkGrammar?: boolean
    },
    refConfig: {                // конфиг атрибута ссылочного типа
      as?: string
      from?: string             // код сущности
      foreignField?: string     // атрибут сущности по которому идет ссылка
      dropdown?: boolean        // отображение в виде выпадающего справочника
      consistCheck?: boolean    // проверка целостности
    },
    calcConfig: {               // конфиг вычисляемого атрибута
      formula?: string          // формула вычисления значения агрумента
      arguments?: EntityAttrCalcArgument[]
    },
    value?: {
      type?: string             // допускается указать сущность для атрибута типа Объект
    }
  }
  configUi: {
    gridConfig: {
      visible?: boolean         // показывать в гриде
    }
  }

  constructor(ind: number) {
    this.id = ''
    this.tempId = uuid()
    this.name = ''
    this.ordNum = ind
    this.descr = ''
    this.code = ''
    this.created = nowDate()
    this.primaryKey = false
    this.multivalued = false
    this.required = false
    this.search = false
    this.ftSearch = false
    this.uniq = false
    this.typeId = undefined
    this.valueTypeId = undefined
    this.config = {
      validateConfig: {},
      refConfig: {},
      calcConfig: {},
    }
    this.configUi = {
      gridConfig: {}
    }
  }
}
