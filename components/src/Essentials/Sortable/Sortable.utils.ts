import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import type { CarrierZone, Carry, CarryMode, CarryPlace } from "../../Abstracts/Carrier/Carrier.types";
import { CarrierUtils } from "../../Abstracts/Carrier/Carrier.utils";
import { InteractionTrackerUtils } from "../../Abstracts/InteractionTracker/InteractionTracker.utils";
import type { NavigatorDirection, NavigatorOrientation } from "../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type { PlacementLayout } from "../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import type { ViewportContextType } from "../../Abstracts/Viewport/Viewport.context.types";
import { ViewportUtils } from "../../Abstracts/Viewport/Viewport.utils";
import type {
    SortableClickAction,
    SortableItemRecord,
    SortableKeyAction,
    SortableOrientation,
    SortablePickUp,
    SortableZoneDefs,
} from "./Sortable.types";

/** A box with no extent has nowhere to aim at inside it. */
const NO_SIZE = 0;

/** The arrows that carry an item, or the focus, later in the list, once the direction text runs in is allowed for. */
const FORWARD_KEYS: Record<SortableOrientation | "both", string[]> = {
    horizontal: ["ArrowRight"],
    vertical: ["ArrowDown"],
    both: ["ArrowRight", "ArrowDown"],
};

/** The arrows that carry it earlier. */
const BACKWARD_KEYS: Record<SortableOrientation | "both", string[]> = {
    horizontal: ["ArrowLeft"],
    vertical: ["ArrowUp"],
    both: ["ArrowLeft", "ArrowUp"],
};

/** A laid-out list has no single axis, so either pair of arrows walks it. */
const PLACED_ORIENTATION: NavigatorOrientation = "both";

/** What cancels a carry. */
const CANCEL_KEY = "Escape";

/** What carries an item to the next list that will take it. */
const NEXT_ZONE_KEY = "Tab";

/** A list's places are its indexes. */
const asIndex = (place: CarryPlace) => place as number;

/**
 * The part of a sortable list that is not about drawing it: which items the keys walk, what each key and click does
 * to a carry, where the landing marker goes, and the zone the list offers every carry.
 *
 * Every function takes the item record whatever its tooltip is written in, so one set of rules serves each
 * framework's list.
 */
export namespace SortableUtils {
    /**
     * The items the arrow keys walk, as indexes into the list.
     *
     * A disabled item is left out unless it asked to stay reachable, so the walk steps over it rather than landing on
     * something that cannot be picked up and says nothing about why.
     *
     * @param items The items, in their current order.
     * @returns The indexes of the walkable items, in order.
     */
    export const computeNavigableIndexes = <T, TTooltipDefs>(items: SortableItemRecord<T, TTooltipDefs>[]) =>
        items.reduce<number[]>((acc, item, index) => {
            const isReachable = InteractionTrackerUtils.computeIsReachable(
                item.isDisabled ?? false,
                item.isReachableWhenDisabled ?? false,
            );

            if (!item.isDisabled || isReachable) acc.push(index);

            return acc;
        }, []);

    /**
     * Which item holds the list's single tab stop.
     *
     * @param navigable The walkable indexes, from {@link computeNavigableIndexes}.
     * @param focusedIndex The item focus last rested on.
     * @returns That item while it can still take focus, and the first walkable item otherwise — `undefined` when
     * there is none.
     */
    export const computeRovingIndex = (navigable: number[], focusedIndex: number) =>
        navigable.includes(focusedIndex) ? focusedIndex : navigable[0];

    /**
     * Where the carry in flight started in this list.
     *
     * Taken as values rather than read from the carry, so a framework can hand over the ones it is tracking.
     *
     * @param sourceZone The zone the carry started in.
     * @param sourcePlace The place it started from.
     * @param zone This list's zone.
     * @returns The index the item was picked up from, or `undefined` when nothing was picked up here.
     */
    export const computeSourceIndex = (
        sourceZone: CarrierZone | undefined,
        sourcePlace: CarryPlace | undefined,
        zone: CarrierZone,
    ) => (sourceZone === zone && sourcePlace !== undefined ? asIndex(sourcePlace) : undefined);

    /**
     * How many places the list offers.
     *
     * One more than it has items while an item from another list is being carried, since that item needs somewhere
     * to land; an item carried within the list already has its own place.
     *
     * @param itemCount How many items the list holds.
     * @param carry The item in flight, if any.
     * @param sourceZone The zone it started in.
     * @param zone This list's zone.
     * @returns The number of places.
     */
    export const computePlaceCount = (
        itemCount: number,
        carry: Carry | undefined,
        sourceZone: CarrierZone | undefined,
        zone: CarrierZone,
    ) => itemCount + (carry !== undefined && sourceZone !== zone ? 1 : 0);

    /**
     * Before which item the landing marker is drawn.
     *
     * @param targetZone The zone the carry is aimed at.
     * @param targetPlace The place it is aimed at there.
     * @param sourceIndex Where the item was picked up in this list, from {@link computeSourceIndex}.
     * @param zone This list's zone.
     * @returns The index the marker sits before, or `undefined` while nothing is aimed at this list.
     */
    export const computeLandingIndex = (
        targetZone: CarrierZone | undefined,
        targetPlace: CarryPlace | undefined,
        sourceIndex: number | undefined,
        zone: CarrierZone,
    ) => {
        if (targetZone !== zone || targetPlace === undefined) return;

        return CarrierUtils.computeMarkerIndex(asIndex(targetPlace), sourceIndex ?? 0, sourceIndex !== undefined);
    };

    /**
     * The place a point is over, for a list a layout arranged.
     *
     * A laid-out list has no axis to compare the point along, so the nearest placement is taken instead.
     *
     * @param layout The layout the items were placed by.
     * @param box The box the layout fills.
     * @param point The point, in client coordinates.
     * @returns The place, or `undefined` when the box has no extent to aim inside.
     */
    export const computePlacedPlace = (layout: PlacementLayout, box: HTMLElement, point: Point2d) => {
        const rect = box.getBoundingClientRect();

        if (rect.width <= NO_SIZE || rect.height <= NO_SIZE) return undefined;

        return PlacementUtils.pickIndex({
            layout,
            point: PlacementUtils.toLayoutPoint(
                { x: (point.x - rect.left) / rect.width, y: (point.y - rect.top) / rect.height },
                layout.heightRatio,
            ),
        });
    };

    /**
     * Where along the list the landing marker is drawn, for a list laid out as a plain row or column.
     *
     * The marker sits halfway between the facing edges of the two items the carry would land between — or between
     * the last item and the end of the list, or the start and the first. It is placed out of flow, so the items being
     * dragged past never move under the pointer. Items are measured on screen and the offset is written in layout
     * space, so the viewport's scale is divided back out, and a scrolled list is allowed for.
     *
     * @param root The list element the marker is placed in.
     * @param rects The items' boxes, in client coordinates.
     * @param markerIndex Before which item the marker goes, from {@link computeLandingIndex}.
     * @param opts.orientation Whether the list runs across or down.
     * @param opts.direction Which way a row runs, which decides which end is its start.
     * @param opts.scale The viewport's scale.
     * @returns The offset along the list, in layout pixels.
     */
    export const computeMarkerOffset = (
        root: HTMLElement,
        rects: DOMRect[],
        markerIndex: number,
        opts: { orientation: SortableOrientation; direction: NavigatorDirection; scale: number },
    ) => {
        const rootRect = root.getBoundingClientRect();
        const isHorizontal = opts.orientation === "horizontal";
        const isReversed = isHorizontal && opts.direction === "rtl";
        const scrolled = isHorizontal ? root.scrollLeft : root.scrollTop;
        const span = isHorizontal ? root.scrollWidth : root.scrollHeight;
        const firstEnd = isReversed ? root.clientWidth : 0;
        const lastEnd = isReversed ? root.clientWidth - span : span;

        if (rects.length < 1) return (firstEnd + lastEnd) * 0.5;

        const nearEdgeOf = (rect: DOMRect) =>
            (isHorizontal ? rect.left - rootRect.left : rect.top - rootRect.top) / opts.scale + scrolled;
        const farEdgeOf = (rect: DOMRect) =>
            (isHorizontal ? rect.right - rootRect.left : rect.bottom - rootRect.top) / opts.scale + scrolled;
        const startOf = isReversed ? farEdgeOf : nearEdgeOf;
        const endOf = isReversed ? nearEdgeOf : farEdgeOf;

        const before = markerIndex > 0 ? endOf(rects[markerIndex - 1]) : firstEnd;
        const after = markerIndex < rects.length ? startOf(rects[markerIndex]) : lastEnd;

        return (before + after) * 0.5;
    };

    /**
     * How big the floating copy of a picked-up item is, and where on it the pointer holds it.
     *
     * A pointer keeps its grip where it pressed; a keyboard pick-up has no grip, so the copy is held by its middle.
     * Everything is in the viewport's content coordinates, so the copy follows the pointer at any scale.
     *
     * @param rect The item's box, in client coordinates.
     * @param viewportContext The viewport the item is drawn in.
     * @param from Where the pointer pressed, in client coordinates, for a pick-up by pointer.
     * @returns `size`, the copy's size; `grabOffset`, where it is held from its corner; and `point`, where the pointer
     * is, or `undefined` for a pick-up by key.
     */
    export const computePickUp = (
        rect: DOMRect,
        viewportContext: ViewportContextType,
        from?: Point2d,
    ): SortablePickUp => {
        const origin = ViewportUtils.getAdjustedClientPoint({ x: rect.left, y: rect.top }, viewportContext);
        const grabbed = from && ViewportUtils.getAdjustedClientPoint(from, viewportContext);
        const scale = viewportContext.getScale();
        const size = { width: rect.width / scale, height: rect.height / scale };

        return {
            size,
            grabOffset: grabbed
                ? { x: grabbed.x - origin.x, y: grabbed.y - origin.y }
                : { x: size.width * 0.5, y: size.height * 0.5 },
            point: grabbed,
        };
    };

    /**
     * What a key pressed on an item does.
     *
     * Enter and Space pick the item up, and put a carried one down. Escape cancels a carry and is left alone
     * otherwise. Tab carries the item to the next list that will take it, Shift reversing the way. While carrying,
     * the list's arrows move the item a place at a time; while not, they walk the list and wrap at the ends. A
     * laid-out list answers to either pair of arrows and ignores the direction text runs in, since its places follow
     * the layout rather than the text.
     *
     * @param key The `key` of the keyboard event.
     * @param opts.index The item the key was pressed on.
     * @param opts.isShifted Whether Shift was held.
     * @param opts.isCarrying Whether a carry begun by key or tap is in flight. A drag is left to the pointer.
     * @param opts.isPlaced Whether a layout arranged the list.
     * @param opts.orientation Whether the list runs across or down.
     * @param opts.direction Which way text runs.
     * @param opts.navigable The walkable indexes, from {@link computeNavigableIndexes}.
     * @returns What to do, or `undefined` when the key is not the list's and should be left alone.
     */
    export const computeKeyAction = (
        key: string,
        opts: {
            index: number;
            isShifted: boolean;
            isCarrying: boolean;
            isPlaced: boolean;
            orientation: SortableOrientation;
            direction: NavigatorDirection;
            navigable: number[];
        },
    ): SortableKeyAction | undefined => {
        if (key === CANCEL_KEY) return opts.isCarrying ? { kind: "cancel" } : undefined;

        if (NavigatorUtils.getIsActivationKey(key)) return opts.isCarrying ? { kind: "drop" } : { kind: "pickUp" };

        if (opts.isCarrying && key === NEXT_ZONE_KEY) return { kind: "aimAtNextZone", step: opts.isShifted ? -1 : 1 };

        const direction = opts.isPlaced ? undefined : opts.direction;
        const axis = opts.isPlaced ? PLACED_ORIENTATION : opts.orientation;
        const logicalKey = NavigatorUtils.computeLogicalKey(key, direction);
        const isForward = FORWARD_KEYS[axis].includes(logicalKey);
        const isBackward = BACKWARD_KEYS[axis].includes(logicalKey);

        if (opts.isCarrying) {
            if (!isForward && !isBackward) return;

            const step = isForward ? 1 : -1;

            return {
                kind: "nudge",
                nudge: opts.orientation === "horizontal" && !opts.isPlaced ? { x: step } : { y: step },
            };
        }

        const position = NavigatorUtils.computeNextPosition(
            key,
            opts.navigable.indexOf(opts.index),
            opts.navigable.length,
            { orientation: axis, direction },
        );

        if (position === undefined) return;

        return { kind: "focus", index: opts.navigable[position] };
    };

    /**
     * What a click does, given how the carry in flight was begun.
     *
     * With nothing carried, a click picks the item up, which is the single-pointer route that needs no dragging. A
     * carry begun by tap is put down by the next click. One begun by key is first aimed at where the click landed, so
     * a keyboard user reaching for the pointer drops where they pointed. A drag is the pointer's own business and the
     * click it leaves behind does nothing.
     *
     * @param mode How the carry in flight was begun, or `undefined` with nothing carried.
     * @returns What to do, or `undefined` for nothing.
     */
    export const computeClickAction = (mode: CarryMode | undefined): SortableClickAction | undefined => {
        if (mode === undefined) return "pickUp";
        if (mode === "drag") return;
        if (mode === "key") return "aimAndDrop";

        return "drop";
    };

    /**
     * What a carry is told about the item it takes.
     *
     * @param item The item.
     * @param groupId The list's group, which is how a list tells its own items from another's.
     * @param key The item's key, which it keeps as it moves.
     * @param label The item's name, as it is announced.
     */
    export const computeCarry = <T, TTooltipDefs>(
        item: SortableItemRecord<T, TTooltipDefs>,
        groupId: string,
        key: string,
        label: string,
    ): Carry => ({ groupId, key, label, value: item });

    /**
     * The zone a sortable list offers every carry: what it accepts, where a point or a nudge lands, how its places are
     * named, and how it takes, puts and moves items.
     *
     * Everything is read through the getters when a carry asks, so the zone is made once and follows the list as it
     * changes. Items are changed only through `updateItems`, and `onTransfer` is told after an item lands here, from
     * this list or another.
     *
     * @param defs The list's state and answers, read at the moment a carry needs them.
     * @returns The zone, to register with the carrier.
     */
    export const createZone = <T, TTooltipDefs>(defs: SortableZoneDefs<T, TTooltipDefs>): CarrierZone => ({
        getGroupId: defs.getGroupId,
        getLabel: defs.getLabel,
        getRootRef: defs.getRootRef,
        getIsDisabled: defs.getIsDisabled,
        getKeyHint: (hasOtherZones) =>
            hasOtherZones ? defs.getAnnouncements().keyHintAcrossZones : defs.getAnnouncements().keyHint,
        getAnnouncements: defs.getAnnouncements,
        computeCanAccept: (carry) => {
            if (defs.getIsDisabled() || defs.getIsLocked()) return false;

            const item = carry.value as SortableItemRecord<T, TTooltipDefs>;

            return defs.computeCanAccept?.(item.value, CarrierUtils.getSourceZone()?.getLabel() ?? "") ?? true;
        },
        computePlaceAtPoint: (point) => {
            const sourceIndex = defs.getSourceIndex();
            const layout = defs.getLayout();
            const box = defs.getBoxRef();
            const placed =
                layout === undefined || box === undefined ? undefined : computePlacedPlace(layout, box, point);

            if (placed !== undefined) return placed;

            return CarrierUtils.computeSettledIndex(
                CarrierUtils.computeDropIndex(
                    defs.getItemRects(),
                    point.x,
                    point.y,
                    defs.getOrientation(),
                    defs.getDirection(),
                ),
                sourceIndex ?? 0,
                sourceIndex !== undefined,
            );
        },
        computeNudgedPlace: (place, nudge) => {
            const step = (nudge.x ?? 0) + (nudge.y ?? 0);

            if (step === 0) return;

            return MathUtils.clamp(asIndex(place) + step, 0, defs.getPlaceCount() - 1);
        },
        computeEntryPlace: () => defs.getSourceIndex() ?? defs.getItems().length,
        computeIsSamePlace: (a, b) => a === b,
        computeIsPlaceAllowed: () => true,
        computePlaceLabel: (place) => defs.getAnnouncements().computePlaceLabel(asIndex(place), defs.getPlaceCount()),
        takeAt: (place) => {
            const index = asIndex(place);

            defs.updateItems((items) => items.filter((_unused, itemIndex) => itemIndex !== index));
        },
        putAt: (place, carry, origin) => {
            const item = carry.value as SortableItemRecord<T, TTooltipDefs>;
            const index = asIndex(place);

            defs.updateItems((items) => [...items.slice(0, index), item, ...items.slice(index)]);

            defs.onTransfer?.({
                value: item.value,
                fromLabel: origin.label,
                toLabel: defs.getLabel(),
                fromIndex: typeof origin.place === "number" ? origin.place : undefined,
                toIndex: index,
            });
        },
        moveAt: (fromPlace, toPlace) => {
            const fromIndex = asIndex(fromPlace);
            const toIndex = asIndex(toPlace);
            const moved = defs.getItems()[fromIndex];

            defs.updateItems((items) => {
                const rest = items.filter((_unused, index) => index !== fromIndex);

                return [...rest.slice(0, toIndex), items[fromIndex], ...rest.slice(toIndex)];
            });

            if (!moved) return;

            defs.onTransfer?.({
                value: moved.value,
                fromLabel: defs.getLabel(),
                toLabel: defs.getLabel(),
                fromIndex,
                toIndex,
            });
        },
    });
}
