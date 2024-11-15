import {errorHandle} from "../utils/messages";
import {API} from "../constants/Constants";

export const getJSON = <T = any>(relativeUrl: string,
                                 params = {},
                                 error: (err: string) => void = errorHandle,
                                 silent = false,
                                 apiPath = API.REACT_APP_API_URL
): Promise<any> => {
    // clear() // сброс всех сообщений пока отключил т.к. на формах после неудачного сохранения обновляются справочники и сбрасывают сообщения
    return API.fetch(`${apiPath}/${relativeUrl}`, {
        method: 'GET',
        ...params,
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response?.json() as Promise<any>;
        })
        .catch((err: any) => {
            if (silent) {
                throw err
            }
            error?.(err)
        })
}

/**
 * Метод post. Обработка ошибок - если флаг silent установлен - проброс ошибки дальше,
 * если не установлен - вывод сообщения и ошибка дальше не пробрасывается
 *
 * @param url
 * @param data
 * @param params
 * @param silent
 */
export const postp = <T = any>(url: string, data?: any, params?: any, silent = false, throwout = true): Promise<any> => {
    // clear() // сброс всех сообщений пока отключил т.к. на формах после неудачного сохранения обновляются встроенные гриды и сбрасывают сообщения
    return API.fetch(`${API.REACT_APP_API_URL}/${url}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        ...params,
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json() as Promise<any>;
        })
        .then(function (data) {
            return data;
        })
        .catch((err: any) => {
            if (!silent) {
                errorHandle(err)
            }
            if (throwout) {
                throw err
            }
        })
}

export const putp = <T = any>(url: string, data?: any, params?: any, silent = false): Promise<any> => {
    return API.fetch(`${API.REACT_APP_API_URL}/${url}`, {
        method: 'PUT',
        data,
        ...params,
    })
        .catch((err: string) => {
            if (silent) {
                throw new Error(err)
            }
            errorHandle(err)
        })
}

/**
 *
 * @param fullUrl
 * @param params
 * @param error
 * @param silent
 */
export const getJSONRaw = <T = any>(fullUrl: string,
                                 params = {},
                                 error: (err: string) => void = errorHandle,
                                 silent = false
): Promise<any> => {
    // clear() // сброс всех сообщений пока отключил т.к. на формах после неудачного сохранения обновляются справочники и сбрасывают сообщения
    return fetch(fullUrl, {
        method: 'GET',
        ...params,
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response
        })
        .catch((err: any) => {
            if (silent) {
                throw err
            }
            error?.(err)
        })
}
