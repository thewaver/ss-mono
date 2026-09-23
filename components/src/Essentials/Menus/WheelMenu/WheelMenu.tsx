import type { Accessor } from "solid-js";
import { createMemo } from "solid-js";

import type { PlacementLayout, PlacementLayoutDefs } from "../../../Abstracts/Placement/Placement.types";
import { PlacementLayoutKnobs } from "../../../Samples/Placement/Layouts/PlacementLayouts.knobs";
import { PlacementLayoutUtils } from "../../../Samples/Placement/Layouts/PlacementLayouts.utils";
import { access } from "../../../Utils/propUtils";
import type { SignalSource } from "../../../Utils/typeUtils";
import { Menu } from "../Menu/Menu";
import type { MenuItem, MenuRenderItem } from "../Menu/Menu.types";
import { WHEEL_MENU_DEFAULTS } from "./WheelMenu.const";
import type { WheelMenuItem, WheelMenuProps } from "./WheelMenu.types";

const FULL_TURN_DEGREES = 360;
const HALF = 0.5;
const ROOT_DEPTH = 0;
const SINGLE_ITEM = 1;

const PAIR = 2;
const CLOSER = Symbol("wheelMenuCloser");

const toFirstArc = (declared: (number | undefined)[], wedgeCount: number, spreadDegrees: number) => {
    const asked = Array.from({ length: wedgeCount }, (_unused, index) => declared[index]);
    const askedTotal = asked.reduce<number>((sum, arc) => sum + (arc ?? 0), 0);
    const freeCount = asked.filter((arc) => arc === undefined).length;
    const evenArc = Math.max(spreadDegrees - askedTotal, 0) / Math.max(freeCount, SINGLE_ITEM);
    const wanted = asked.map((arc) => arc ?? evenArc);
    const total = wanted.reduce<number>((sum, arc) => sum + arc, 0);

    return ((wanted[0] ?? 0) * spreadDegrees) / Math.max(total, Number.EPSILON);
};

type WheelValue<T> = T | typeof CLOSER;

export const WheelMenu = <T,>(props: WheelMenuProps<T>) => {
    const getSpreadDegrees = () => access(props.spreadDegrees) ?? FULL_TURN_DEGREES;

    const getItemsAt = (path: number[]) =>
        path.reduce<WheelMenuItem<T>[]>((list, index) => list[index]?.items ?? [], access(props.items));

    const computeLayout = (layoutDefs: PlacementLayoutDefs): PlacementLayout => {
        const given = props.layoutDefs ?? {};
        const base = PlacementLayoutKnobs.BAND_DEFAULTS;
        const bandWidth = access(props.bandWidth) ?? WHEEL_MENU_DEFAULTS.bandWidth;
        const itemRadiusRatio = given.itemRadiusRatio ?? base.itemRadiusRatio;
        const itemMaxWidthRatio = given.itemMaxWidthRatio ?? base.itemMaxWidthRatio;
        const rootHoleRadius = access(props.holeRadius) ?? WHEEL_MENU_DEFAULTS.holeRadius;
        const rootGapDegrees = given.wedgeGapDegrees ?? base.wedgeGapDegrees;
        const levelGap = access(props.levelGap) ?? WHEEL_MENU_DEFAULTS.levelGap;
        const path = layoutDefs.path ?? [];
        const depth = path.length;
        const holeRadius = rootHoleRadius + depth * (bandWidth + levelGap);
        const outerRadius = holeRadius + bandWidth;
        const itemRadius = holeRadius + bandWidth * itemRadiusRatio;
        const rootItemRadius = rootHoleRadius + bandWidth * itemRadiusRatio;
        const wedgeGapDegrees = (rootGapDegrees * rootItemRadius) / itemRadius;
        const hasCloser = props.closerDefs !== undefined && depth === ROOT_DEPTH;
        const wedgeCount = hasCloser ? layoutDefs.itemCount - SINGLE_ITEM : layoutDefs.itemCount;
        const opener = layoutDefs.parentPlacement?.sector;
        const askedPerWedge =
            PlacementLayoutUtils.toChordAngle(itemRadius, bandWidth * itemMaxWidthRatio) + wedgeGapDegrees;
        const spreadDegrees =
            depth === ROOT_DEPTH ? getSpreadDegrees() : Math.min(wedgeCount * askedPerWedge, FULL_TURN_DEGREES);
        const computeItemArcs = () => getItemsAt(path).map((item) => item.arcDegrees);
        const fillsTurn = spreadDegrees >= FULL_TURN_DEGREES;
        const topFacingDegrees = fillsTurn
            ? base.facingDegrees + (spreadDegrees - toFirstArc(computeItemArcs(), wedgeCount, spreadDegrees)) * HALF
            : base.facingDegrees;
        const facingDegrees = opener
            ? (opener.fromAngle + opener.toAngle) * HALF
            : (given.facingDegrees ?? topFacingDegrees);

        const ring = PlacementLayoutUtils.createRing({
            ...given,
            holeRatio: holeRadius / outerRadius,
            wedgeGapDegrees,
            facingDegrees,
            spreadDegrees,
            computeItemArcs,
        })({ itemCount: wedgeCount });
        const layout = { ...ring, extent: outerRadius * PAIR };

        if (!hasCloser) return layout;

        const origin = layout.origin ?? { x: HALF, y: HALF };
        const closerSize = holeRadius / outerRadius;

        return {
            ...layout,
            placements: [
                ...layout.placements,
                { left: origin.x, top: origin.y, width: closerSize, height: closerSize },
            ],
        };
    };

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
            computeLayout={computeLayout}
            computeCustomText={props.computeCustomText || props.closerDefs ? computeCustomText : undefined}
            renderItem={renderItem}
            onActivate={(value) => {
                if (value === CLOSER) return;

                props.onActivate(value);
            }}
        />
    );
};
