import {FlattenOptionData} from "rc-select/lib/interface";

type OptionData<T = any> = FlattenOptionData<T> & {item: T}

export default OptionData
