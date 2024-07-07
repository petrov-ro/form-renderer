import moment, {Moment} from "moment/moment"
import {capitalize} from "./stringHelper";
import {DATE_FORMAT, BACK_DATE_TIME_FORMAT} from "../constants/Constants";

export const nowDate = () => moment()

export const convertNotNullStrToDate = (dateStr: string, format: string = DATE_FORMAT): Moment => {
  const result = moment(dateStr, format)
  return result;
}

export const convertStrToDate = (dateStr: string | undefined, format: string = BACK_DATE_TIME_FORMAT): Moment | undefined => {
    if (dateStr) {
        const result = convertNotNullStrToDate(dateStr, format)
        if (result.isValid()) {
            return result;
        }
    }
    return undefined
}


export const convertDateToStr = (date: Moment, format: string = DATE_FORMAT): string | undefined => {
    if (date && date.isValid()) {
        const result = date.format(format)
        return result;
    }
    return undefined
}

export const convertStrToStr = (initStr: string, targetFormat: string = BACK_DATE_TIME_FORMAT): string | undefined => {
  const date = moment(initStr)
  const dateStr = convertDateToStr(date, targetFormat)
  return dateStr || ''
}

export const convertStrToStrNotNull = (initStr: string, targetFormat: string = BACK_DATE_TIME_FORMAT): string => {
  const date = moment(initStr)
  const dateStr = convertDateToStr(date, targetFormat)
  return dateStr || initStr
}

export const getMonthName = (month: number | string) =>
    capitalize(moment(month, 'MM').format('MMMM'));

export const addToStr = (dateStr: string | undefined,
                                 format: string = DATE_FORMAT,
                                 amount: number,
                                 type: any): string | undefined => {
    if (dateStr) {
        const date = convertNotNullStrToDate(dateStr, format)
        if (date.isValid()) {
            const newDate =  date.add(amount, type);
            return convertDateToStr(newDate, format)
        }
    }
    return undefined
}

export const getSeconds = () => moment().seconds()
