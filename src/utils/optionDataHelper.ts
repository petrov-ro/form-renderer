import OptionData from "../models/types/OptionData";

export const newOptionData = (value: any, label?: any, p: any = {}) => ({value, label: label || value, ...p} as OptionData)
