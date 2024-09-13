import {FormType} from "../../models/types/FormType";
import {FormLayout} from "antd/es/form/Form";
import {FormModes} from "../../constants/FormModes";
import {FormInstance} from "antd/lib/form/Form";
import {NamePath} from "antd/lib/form/interface";

export type FormProps<T = any> = {
  id?: string;
  data?: object;
  type?: FormType;
  form?: FormInstance<T>;
  scope?: object;
  onClose?: () => void;
  onSave?: (values: any) => void;
  onFinish?: (values: any, setSpinning: Function) => void;     // кастомный сабмит
  // onAfterSave?: onAfterSaveType                             // вызывается после успешного сохранения
  onAfterGetData?: (response: any) => void;                    // вызывается после загрузки данных
  setVisible?: (v: boolean) => void;
  fileFields?: string[];                                       // наименования полей с файлами для предзагрузки при сохранении
  layout?: FormLayout;
  name?: NamePath
  initialValues?: any
  record?: any
  gridData?: any[]
  mode?: FormModes
  filterForm?: FormInstance
}
