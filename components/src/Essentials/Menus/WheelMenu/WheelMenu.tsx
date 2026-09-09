import type { Accessor } from "solid-js";
import { createMemo } from "solid-js";

import { createArc } from "../../../Samples/Placement/Layouts/PlacementLayouts.const";
import { access } from "../../../Utils/propUtils";
import type { SignalSource } from "../../../Utils/typeUtils";
import { Menu } from "../Menu/Menu";
import type { MenuItem, MenuRenderItem } from "../Menu/Menu.types";
import type { WheelMenuItem, WheelMenuProps } from "./WheelMenu.types";

const FULL_TURN_DEGREES = 360;
const CLOSER = Symbol("wheelMenuCloser");

type WheelValue<T> = T | typeof CLOSER;

export const WheelMenu = <T,>(props: WheelMenuProps<T>) => {
    const getSpreadDegrees = () => access(props.spreadDegrees) ?? FULL_TURN_DEGREES;

    const getItemsAt = (path: number[]) =>
        path.reduce<WheelMenuItem<T>[]>((list, index) => list[index]?.items ?? [], access(props.items));

    const getComputeLayout = createMemo(() =>
        createArc(getSpreadDegrees(), {
            ...props.layoutDefs,
            hasCentreItem: props.closerDefs !== undefined,
            computeItemArcs: (path) => getItemsAt(path).map((item) => item.arcDegrees),
        }),
    );

    const getItems = createMemo<MenuItem<WheelValue<T>>[]>(() => {
        const items = access(props.items) as MenuItem<WheelValue<T>>[];
        const closerDefs = props.closerDefs;

        return closerDefs ? [...items, { value: CLOSER, ariaLabel: closerDefs.ariaLabel }] : items;
    });

    const renderItem: MenuRenderItem<WheelValue<T>> = (getItem, getFlags, getPlacement) =>
        getItem().value === CLOSER
            ? props.closerDefs!.renderContent(getFlags)
            : props.renderItem(getItem as Accessor<MenuItem<T>>, getFlags, getPlacement);

    const computeCustomText = (item: MenuItem<WheelValue<T>>) =>
        item.value === CLOSER ? "" : (props.computeCustomText?.(item as MenuItem<T>) ?? "");

    return (
        <Menu<WheelValue<T>>
            {...props}
            items={getItems}
            checkedSignal={props.checkedSignal as SignalSource<WheelValue<T>[]> | undefined}
            computeLayout={(defs) => getComputeLayout()(defs)}
            computeCustomText={props.computeCustomText || props.closerDefs ? computeCustomText : undefined}
            renderItem={renderItem}
            onActivate={(value) => {
                if (value === CLOSER) return;

                props.onActivate(value);
            }}
        />
    );
};
