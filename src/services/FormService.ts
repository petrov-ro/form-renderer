import {getJSON} from "./AbstractService";
import {FormType} from "../models/types/FormType";
import {Key} from "react";

/**
 * Получение записи
 *
 * @param type            - тип записи
 * @param id              - идентификатор записи
 * @param record          - гридовая запись
 * @param successHandle
 * @param errorHandle
 * @param finalHandle
 */
export const getFormData = (type: FormType | undefined,
                            id: Key | undefined,
                            record: object | undefined,
                            successHandle?: any,
                            errorHandle?: any,
                            finalHandle?: () => void) => {
  if (type && (id || record)) {
    const url = type.url?.(record || id) || `${type.getRoute || type.route}/${id}`;

    getJSON(url, undefined, errorHandle)
      .then(successHandle)
      .finally(finalHandle)
  } else {
    finalHandle?.()
  }
}
