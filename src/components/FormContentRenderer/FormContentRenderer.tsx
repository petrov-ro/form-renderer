import React, {Dispatch, SetStateAction} from "react";
import {StatisticsFormElementClass} from "../../models/classes/StatisticsFormElementClass";
import StatisticsFormConstructorElement
  from "../../components/StatisticsFormConstructorElement/StatisticsFormConstructorElement";
import {FormInstance} from "antd/es/form/Form";

type FormContentRendererProps = {
  elements: StatisticsFormElementClass[]                                // элементы размещенные на форме
  setElements?: Dispatch<SetStateAction<StatisticsFormElementClass[]>>  // изменение элементов на форме
  edit?: boolean                                                        // режим редактирования формы в режиме конструктора
  reportMode?: boolean                                                  // режим ввода данных
  editComponent?: string                                                // идентификатор редактируемого компонента
  setEditComponent?: Dispatch<SetStateAction<string | undefined>>       // установка редактируемого компонента
  className?: string                                                    // css-классы контейнера
  form: FormInstance
}

/**
 * Рендер тела формы
 *
 * @param props
 * @constructor
 */
const FormContentRenderer: React.FC<FormContentRendererProps> = props => {
  const {
    elements = [], setElements = () => {},
    editComponent, setEditComponent = () => {},
    edit = false, reportMode, className, form
  } = props

  return (
    <div className={className}>
      {elements.map((elem: StatisticsFormElementClass) =>
        <StatisticsFormConstructorElement key={elem.id} currentElement={elem}
                                          edit={edit} reportMode={reportMode}
                                          elements={elements}
                                          setElements={undefined}
                                          editComponent={editComponent}
                                          setEditComponent={undefined} form={form}/>)
      }
    </div>
  )
}

export default FormContentRenderer
