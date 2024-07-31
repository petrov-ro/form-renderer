import React, {Key, useEffect} from "react";
import {Form} from "antd";
import {Spin} from "@gp-frontend-lib/ui-kit-5";
import {EntityClass} from "../../../models/classes/EntityClass";
import {FormConfigComponentType} from "../../../models/types/FormConfigComponentType";
import useObject from "../../../hooks/useObject";
import {entityDataFormType} from "../../../constants/FormTypes";
import FormContentRenderer from "../../FormContentRenderer/FormContentRenderer";

type RefDropdownEmbeddedFormProps = {
  viewTypeForm?: string         // идентификатор формы для отображения записи
  id: Key                       // айди записи сущности
  entity: EntityClass           // сущность
}

/**
 * Компонент отображения записи сущности по кастомной форме с вкладки Компоненты форм сбора
 *
 * @param props
 * @constructor
 */
const RefDropdownEmbeddedForm: React.FC<RefDropdownEmbeddedFormProps> = props => {
  const {
    viewTypeForm, id, entity
  } = props

  const [form] = Form.useForm();

  const {
    code,
    config: {
      formConfig: {
        components = [] as FormConfigComponentType[]
      } = {}
    } = {}
  } = entity

  // получение кастомной формы по идентификатору
  const formComponent = components.find(f => f.id === viewTypeForm)

  // формирование типа справочника для получения записи
  const formType = entityDataFormType(code, '', [], true)

  // получение записи
  const {object, loading} = useObject<Record<string, any>>(formType, id)

  // установка значений формы при получении объекта
  useEffect(() => {
    form.setFieldsValue(object)
  }, [object])

  return (
    <Spin spinning={loading}>
      {formComponent && object &&
      <Form form={form} initialValues={object}>
          <FormContentRenderer
              elements={formComponent?.config?.elements}
              form={form}
          />
      </Form>
      }
    </Spin>
  )
}

export default React.memo(RefDropdownEmbeddedForm)
