import {FormTypeIdsEnum} from "../../constants/FormTypes";
import {EntityAttrClass} from "../../models/classes/EntityAttrClass";
import {ModalFormWidth} from "../../constants/ModalFormWidth";
import {Key} from "react";

export type FormType = {
  id: FormTypeIdsEnum
  key?: string
  route?: string
  getRoute?: string
  createRoute?: string
  updateRoute?: string
  name: string
  url?: (data?: Key | string | object) => string
  urlRemove?: (data?: string | object) => string
  files?: string[]
  createMethod?: (url: string, data?: any, params?: any) => Promise<any>
  updateMethod?: (url: string, data?: any, params?: any) => Promise<any>
  attrs?: EntityAttrClass[]
  component?: React.FC
  width?: ModalFormWidth
}
