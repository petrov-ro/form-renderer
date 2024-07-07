import React from "react";
import {STATISTICS_FORM_CONFIG_VIEW} from "../../../../constants/Statistics";
import FormField from "../../../../components/FormField/FormField";
import {FormItemTypes} from "../../../../constants/FormItemTypes";
import {newOptionData} from "../../../../utils/optionDataHelper";
import {StatisticsFormConstructorViewConfigProps} from "../../../../models/types/StatisticsFormConstructorViewConfigProps";

// варианты выбора количества колонок
const colOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(v => newOptionData(v))

// варианты выбора количества строк
const rowOptions = (new Array(100))
  .fill(undefined)
  .map((_, i) => i + 1)
  .map(v => newOptionData(v))

/**
 * Конфиг компонента Сетка на форме сбора
 *
 * @param props
 * @constructor
 */
const StatisticsGridConfig:  React.FC<StatisticsFormConstructorViewConfigProps> = (
  {field = STATISTICS_FORM_CONFIG_VIEW, form}
) => {

  return (
    <>
      <FormField
        label='Количество колонок' name={[field, 'colCount']} inputType={FormItemTypes.select}
        fieldProps={{options: colOptions}}
      />

      <FormField
        label='Ширина колонки' name={[field, 'colSpan']} inputType={FormItemTypes.select}
        fieldProps={{options: colOptions}}
      />

      <FormField
        label='Количество строк' name={[field, 'rowCount']} inputType={FormItemTypes.select}
        fieldProps={{options: rowOptions}}
      />
    </>
  )
}

export default StatisticsGridConfig
