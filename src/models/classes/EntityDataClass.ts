import {DATA_SYSTEM_KEY, SYS_DATA} from "@/constants/Constants";

export class EntityDataClass {
  [DATA_SYSTEM_KEY]?: string;
  [propName: string]: any;
  children?: EntityDataClass[]
  [SYS_DATA]?: {
    changed?: string
    created?: string
    model_version?: number
  };

  constructor() {
    this[DATA_SYSTEM_KEY] = undefined;
    this[SYS_DATA] = undefined;
  }
}

export class EntityTreeDataClass extends EntityDataClass {
  children: EntityTreeDataClass[]

  constructor() {
    super()
    this.children = [] as EntityTreeDataClass[];
  }
}
