import type { Accessor } from "solid-js";
import { createMemo } from "solid-js";

import { type PlacementLayout, type PlacementLayoutDefs, WheelMenuUtils } from "@thewaver/ss-components";

import { access } from "../../../Utils/propUtils";
import type { SignalSource } from "../../../Utils/typeUtils";
import { Menu } from "../Menu/Menu";
import type { MenuItem, MenuRenderItem } from "../Menu/MenuSolid.types";
import type { WheelMenuProps } from "./WheelMenuSolid.types";

type WheelValue<T> = T | typeof WheelMenuUtils.CLOSER_VALUE;

export const WheelMenu = <T,>(props: WheelMenuProps<T>) => {
    const computeLayout = (layoutDefs: PlacementLayoutDefs): PlacementLayout =>
        WheelMenuUtils.computeLayout(layoutDefs, {
            items: access(props.items),
            spreadDegrees: access(props.spreadDegrees),
            holeRadius: access(props.holeRadius),
            bandWidth: access(props.bandWidth),
            levelGap: access(props.levelGap),
            layoutDefs: props.layoutDefs,
            hasCloser: props.closerDefs !== undefined,
        });

    const getItems = createMemo(
        () => WheelMenuUtils.withCloser(access(props.items), props.closerDefs?.ariaLabel) as MenuItem<WheelValue<T>>[],
    );

    const renderItem: MenuRenderItem<WheelValue<T>> = (getItem, getFlags, getPlacement) =>
        WheelMenuUtils.getIsCloser(getItem().value)
            ? props.closerDefs!.renderContent(getFlags)
            : props.renderItem(getItem as Accessor<MenuItem<T>>, getFlags, getPlacement);

    const computeCustomText = (item: MenuItem<WheelValue<T>>) =>
        WheelMenuUtils.getIsCloser(item.value) ? "" : (props.computeCustomText?.(item as MenuItem<T>) ?? "");

    return (
        <Menu<WheelValue<T>>
            {...props}
            items={getItems}
            checkedSignal={props.checkedSignal as SignalSource<WheelValue<T>[]> | undefined}
            computeLayout={computeLayout}
            computeCustomText={props.computeCustomText || props.closerDefs ? computeCustomText : undefined}
            renderItem={renderItem}
            onActivate={(value) => {
                if (WheelMenuUtils.getIsCloser(value)) return;

                props.onActivate(value);
            }}
        />
    );
};
