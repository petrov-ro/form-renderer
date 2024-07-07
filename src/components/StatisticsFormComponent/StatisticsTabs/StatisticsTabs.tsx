import React, {ChangeEvent, useState } from "react";
import {StatisticsFormElementExtendedType} from "../../../models/types/StatisticsFormElementExtendedType";
import DraggableTabs from "../../../components/DraggableTabs/DraggableTabs";
import {uuid} from "../../../utils/common";
import {Button, Input} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import StatisticsTab, {StatisticsTabsTabType} from "../../../components/StatisticsFormComponent/StatisticsTabs/StatisticsTab/StatisticsTab";

type StatisticsTabsValueType = StatisticsTabsTabType[]    // тип значения элемента Вкладки
type StatisticsTabsConfigViewType = any                   // тип конфигурации отображения компонента Вкладки
type StatisticsTabsType = StatisticsFormElementExtendedType<StatisticsTabsValueType, undefined, StatisticsTabsConfigViewType>

/**
 * Компонент со вкладками на форме сбора
 *
 * @param props
 * @constructor
 */
const StatisticsTabs: React.FC<StatisticsTabsType> = props => {
  const {currentElement, edit, changeValue, editComponent, setEditComponent} = props
  const {id, value = [], config: currentConfig} = currentElement

  const config = {
    ...currentConfig,
  }

  // ключ таба
  const tabKey = (tab?: StatisticsTabsTabType) => tab?.id || '0'

  const [tabMenuItem, setTabMenuItem] = useState(tabKey(value[0]))
  const [editingTab, setEditingTab] = useState<Map<string, string>>(new Map())

  // заголовок таба
  const tabLabel = (tab: StatisticsTabsTabType) => {
    // сохранение названия таба
    const save = () => {
      changeValue(value.map((t: StatisticsTabsTabType) => t.id === tab.id ? {
        ...t,
        name: editingTab.get(t.id)!
      } : t))
      const newEditingTab = new Map(editingTab)
      newEditingTab.delete(tab.id)
      setEditingTab(newEditingTab)
    }

    return (
      <span>
      {!editingTab.has(tab.id) &&
      <>
          <Button type='link' icon={<EditOutlined/>}
                  onClick={() => {
                    const newEditingTab = new Map(editingTab)
                    newEditingTab.set(tab.id, tab.name)
                    setEditingTab(newEditingTab)
                  }}/>
        {tab.name}
      </>
      }
        {editingTab.has(tab.id) &&
        <>
            <Button type='link' icon={<SaveOutlined/>}
                    onClick={save}/>
            <Input defaultValue={editingTab.get(tab.id)}
                   onKeyDown={(e) => {
                     if (e.which == 13) {
                       save()
                     } else {
                       e.stopPropagation()
                     }
                   }}
                   onChange={(v: ChangeEvent<HTMLInputElement>) => {
                     setEditingTab(editingTab.set(tab.id, v.target.value))
                   }}
            />
        </>
        }
    </span>
    )
  }

  // добавление вкладки
  const addNewTab = () => {
    const newTabs = [...value]
    const newTab = {
      name: 'Новая вкладка',
      id: uuid(),
      ordNum: newTabs.length + 1
    }
    newTabs.push(newTab)
    changeValue(newTabs)
  }

  // удаление вкладки
  const removeTab = (targetKey: React.MouseEvent | React.KeyboardEvent | string) => {
    const targetIndex = value.findIndex((tab: StatisticsTabsTabType) => tabKey(tab) === targetKey);
    const newPanes = value.filter((tab: StatisticsTabsTabType) => tabKey(tab) !== targetKey);
    if (newPanes.length > 0) {
      const {id: newTabMenuId} = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setTabMenuItem(newTabMenuId);
    }
    changeValue(newPanes);
  };

  const onEditTab = (e: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'add') {
      addNewTab();
    } else {
      removeTab(e);
    }
  };

  // меню табов
  const tabMenuItems = () => value
    .sort((a: StatisticsTabsTabType, b: StatisticsTabsTabType) => a.ordNum - b.ordNum)
    .map((tab: StatisticsTabsTabType, i: number) => ({
      tab,
      label: tabLabel(tab),
      key: tabKey(tab),
      children: (
        <StatisticsTab
          value={value} onChange={changeValue} index={i} edit={edit}
          editComponent={editComponent} setEditComponent={setEditComponent}
        />
      ),
    }))

  return (
    <div className={`statistics-tabs-container component-${id}`}>
      <DraggableTabs
        type={edit ? 'editable-card' : 'card'}
        activeKey={tabMenuItem}
        onChange={setTabMenuItem}
        items={tabMenuItems()}
        onEdit={onEditTab}
        {...config}
      />
    </div>
  )
}

export default StatisticsTabs
