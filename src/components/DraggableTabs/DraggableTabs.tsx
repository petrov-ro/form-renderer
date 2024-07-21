import * as React from "react";
import {ReactElement, useRef, useState} from "react";
import cn from 'classnames'
import {useDrag, useDrop} from "react-dnd";
import {Tabs} from 'antd';
import {TabsProps} from "antd/lib/tabs";
import './DraggableTabs.scss'

interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
    index: React.Key;
    moveNode: (dragIndex: React.Key, hoverIndex: React.Key) => void;
}

export const DRAGGABLE_TAB_NODE_TYPE = 'DraggableTabNode';

const DraggableTabNode = ({index, children, moveNode}: DraggableTabPaneProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{isOver, dropClassName}, drop] = useDrop({
        accept: DRAGGABLE_TAB_NODE_TYPE,
        collect: monitor => {
            const {index: dragIndex} = monitor.getItem<any>() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: 'dropping',
            };
        },
        drop: (item: { index: React.Key }) => {
            moveNode(item.index, index);
        },
    });
    const [, drag] = useDrag({
        type: DRAGGABLE_TAB_NODE_TYPE,
        item: {index},
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));

    return (
        <div ref={ref} className={cn({[dropClassName!]: dropClassName && isOver}, 'draggable-tab-node')}>
            {children}
        </div>
    );
};

const DraggableTabs: React.FC<TabsProps> = props => {
    const {items = []} = props;

    const [order, setOrder] = useState<React.Key[]>([]);

    const moveTabNode = (dragKey: React.Key, hoverKey: React.Key) => {
        const newOrder = order.slice();

        items.forEach(item => {
            if (item.key && newOrder.indexOf(item.key) === -1) {
                newOrder.push(item.key);
            }
        });

        const dragIndex = newOrder.indexOf(dragKey);
        const hoverIndex = newOrder.indexOf(hoverKey);

        newOrder.splice(dragIndex, 1);
        newOrder.splice(hoverIndex, 0, dragKey);

        setOrder(newOrder);
    };

    const renderTabBar: TabsProps['renderTabBar'] = (tabBarProps, TabBar) => {
        return (
            <TabBar {...tabBarProps}>
                {(node: ReactElement) => (
                    <DraggableTabNode key={node.key} index={node.key!} moveNode={moveTabNode}
                                      className={cn('draggable-tab-node')}>
                        {node}
                    </DraggableTabNode>
                )}
            </TabBar>
        )
    }

    const orderItems = [...items]
        .sort((a, b) => {
            const orderA = order.indexOf(a.key!);
            const orderB = order.indexOf(b.key!);

            if (orderA !== -1 && orderB !== -1) {
                return orderA - orderB;
            }
            if (orderA !== -1) {
                return -1;
            }
            if (orderB !== -1) {
                return 1;
            }

            const ia = items.indexOf(a);
            const ib = items.indexOf(b);

            return ia - ib;
        });

    return (
        <Tabs renderTabBar={renderTabBar} {...props} items={orderItems}/>
    );
};

export default DraggableTabs
