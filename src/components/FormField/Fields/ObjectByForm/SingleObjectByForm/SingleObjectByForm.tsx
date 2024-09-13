import React, {useCallback, useEffect} from 'react';
import {Form} from 'antd';
import FormContentRenderer from "../../../../FormContentRenderer/FormContentRenderer";
import {StatisticsFormConfig} from "../../../../../models/classes/StatisticsFormConfig";
import {objectCompare} from "../../../../../utils/objectUtils";

type FormAttributeObjectProps = {
  value: Record<string, any>                  // объект который нужно показать на форме
  onChange: (v: Record<string, any>) => void  // колбек изменение значений на форме
  config: StatisticsFormConfig                // массив элементов (конфиг формы сбора)
  name?: string | string[]                    // название атрибута-родителя
}

/**
 * Компонент вывода объекта по форме (компонент формы сбора)
 *
 * @param props
 * @constructor
 */
const SingleObjectByForm: React.FC<FormAttributeObjectProps> = props => {
  const {
    name
  } = props

  return (
        <></>
  )
}

export default React.memo(SingleObjectByForm)
