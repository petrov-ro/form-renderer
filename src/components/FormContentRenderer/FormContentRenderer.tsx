import React, {Dispatch, SetStateAction} from "react";
import {NamePath} from "antd/es/form/interface";
import {StatisticsFormElementClass} from "../../models/classes/StatisticsFormElementClass";
import StatisticsFormConstructorElement
  from "../../components/StatisticsFormConstructorElement/StatisticsFormConstructorElement";

type FormContentRendererProps = {
  elements: StatisticsFormElementClass[]                                // элементы размещенные на форме
  setElements?: Dispatch<SetStateAction<StatisticsFormElementClass[]>>  // изменение элементов на форме
  edit?: boolean                                                        // режим редактирования формы в режиме конструктора
  editComponent?: string                                                // идентификатор редактируемого компонента
  setEditComponent?: Dispatch<SetStateAction<string | undefined>>       // установка редактируемого компонента
  className?: string                                                    // css-классы контейнера
  name?: NamePath                                                       // название атрибута-родителя
  path?: NamePath                                                       // путь к атрибуту
}

/**
 * Рендер тела формы
 *
 * @param props
 * @constructor
 */
const FormContentRenderer: React.FC<FormContentRendererProps> = props => {
  const {
    elements = [], editComponent, edit = false, className, name, path
  } = props

  return (
    <div className={className}>
      {elements.map((elem: StatisticsFormElementClass) =>
        <StatisticsFormConstructorElement key={elem.id} name={name} path={path}
                                          currentElement={elem}
                                          edit={edit}
                                          elements={elements}
                                          setElements={undefined}
                                          editComponent={editComponent}
                                          setEditComponent={undefined}/>)
      }
    </div>
  )
}

export default React.memo(FormContentRenderer)
