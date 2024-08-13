import {useEffect, useState} from "react";
import {isArray} from "../../utils/arrayUtils";
import {Button} from "@gp-frontend-lib/ui-kit-5";
import {gridMultivalueDelimeter} from "../../constants/Constants";
import {MoreOutlined, ShrinkOutlined} from "@ant-design/icons";
import * as React from "react";

type TextLimitType = {
  text: string | string[]   // строка или массив строк
  limit?: number            // количество символов
}

/**
 * Элемент для вывода части текста с возможностью раскрытия полного содержимого
 *
 * @param text  - текст для вывода
 * @param limit - количество символов отображаемое необрезанным
 */
const TextLimit = (props: TextLimitType): JSX.Element => {
  const {text, limit = 0} = props
  const val = isArray(text) ? (text as string[]).join(gridMultivalueDelimeter) : text
  const initialDisplay = limit > 0 ? text.slice(0, limit) : val

  const [display, setDisplay] = useState(initialDisplay)

  useEffect(() => {
    setDisplay(initialDisplay)
  }, [text, limit])

  const more = display && display.length !== val.length
  const shrink = display && display.length !== initialDisplay.length

  return (
    <div style={{display: 'inline-block'}}>
      {display}
      {more &&
      <Button type="primary" ghost key="primary" size='small'
              style={{margin: '0 7px', color: 'lightgray', borderColor: 'lightgray', lineHeight: '20px', height: '20px'}}
              title='Показать полностью'
              onClick={() => setDisplay(val)}>
          <MoreOutlined rotate={90}/>
      </Button>
      }
      {!more && shrink &&
      <Button type="primary" ghost key="primary" size='small'
              style={{margin: '0 7px', color: 'lightgray', borderColor: 'lightgray', lineHeight: '20px', height: '20px'}}
              title='Свернуть'
              onClick={() => setDisplay(initialDisplay)}>
          <ShrinkOutlined rotate={45}/>
      </Button>
      }
    </div>
  )
}

export default TextLimit;
