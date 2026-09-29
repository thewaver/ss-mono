import { useCallback, useMemo } from "react";

import { type PlacementLayoutDefs, WheelMenuUtils } from "@thewaver/ss-components";

import { Menu } from "../Menu/Menu";
import type { MenuItem, MenuRenderItem } from "../Menu/Menu.types";
import type { WheelMenuProps } from "./WheelMenu.types";

type WheelValue<T> = T | typeof WheelMenuUtils.CLOSER_VALUE;

type WheelCheckedState<T> = readonly [WheelValue<T>[], (checked: WheelValue<T>[]) => void];

export const WheelMenu = <T,>(props: WheelMenuProps<T>) => {
    const { items, spreadDegrees, holeRadius, bandWidth, levelGap, layoutDefs, closerDefs } = props;

    const hasCloser = closerDefs !== undefined;
    const closerAriaLabel = closerDefs?.ariaLabel;

    const computeLayout = useCallback(
        (defs: PlacementLayoutDefs) =>
            WheelMenuUtils.computeLayout(defs, {
                items,
                spreadDegrees,
                holeRadius,
                bandWidth,
                levelGap,
                layoutDefs,
                hasCloser,
            }),
        [items, spreadDegrees, holeRadius, bandWidth, levelGap, layoutDefs, hasCloser],
    );

    const menuItems = useMemo(
        () => WheelMenuUtils.withCloser(items, closerAriaLabel) as MenuItem<WheelValue<T>>[],
        [items, closerAriaLabel],
    );

    const renderItem: MenuRenderItem<WheelValue<T>> = (item, flags, placement) =>
        WheelMenuUtils.getIsCloser(item.value)
            ? closerDefs!.renderContent(flags)
            : props.renderItem(item as MenuItem<T>, flags, placement);

    const computeCustomText = (item: MenuItem<WheelValue<T>>) =>
        WheelMenuUtils.getIsCloser(item.value) ? "" : (props.computeCustomText?.(item as MenuItem<T>) ?? "");

    return (
        <Menu<WheelValue<T>>
            {...props}
            items={menuItems}
            checked={props.checked as WheelCheckedState<T> | undefined}
            computeLayout={computeLayout}
            computeCustomText={props.computeCustomText || hasCloser ? computeCustomText : undefined}
            renderItem={renderItem}
            onActivate={(value) => {
                if (WheelMenuUtils.getIsCloser(value)) return;

                props.onActivate(value);
            }}
        />
    );
};
