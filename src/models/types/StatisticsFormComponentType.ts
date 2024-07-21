import {StatisticsFormComponentTypeEnum} from "../../constants/StatisticsFormComponent";
import {StatisticsFormElementExtendedType} from "./StatisticsFormElementExtendedType";
import { FormInstance } from "antd";

/**
 * Тип компонента в конструкторе форм сбора
 */
export type StatisticsFormComponentType<T = any> = {
  name: string
  type: StatisticsFormComponentTypeEnum
  icon: React.ReactElement                                                       // иконка на панели выбора компонентов
  defaultValue?: T                                                               // дефолтное value компонента
  render: (props: StatisticsFormElementExtendedType<T>) => React.ReactElement    // отрисовка компонента
  configRender?: (props: {form: FormInstance}) => React.ReactElement             // отрисовка конфига компонента (если не задано - отрисовывается стандартный конфиг)
}
