import {
    Index,
    Show,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    onCleanup,
    onMount,
    untrack,
} from "solid-js";
import { Portal } from "solid-js/web";

import {
    AnchorUtils,
    CarrierUtils,
    type CarrierZone,
    type CarryMode,
    SORTABLE_GRID_DEFAULTS,
    type SortableGridItemFlags,
    type SortableGridPlace,
    type SortableGridShape,
    type SortableGridSpot,
    SortableGridUtils,
    SortableUtils,
    ViewportUtils,
    SortableGridStyles as styles,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { CarrierSolidUtils } from "../../Abstracts/Carrier/CarrierSolid.utils";
import { ElevationSolidUtils } from "../../Abstracts/Elevation/ElevationSolid.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { LabelSolidUtils } from "../../Essentials/Input/Label/LabelSolid.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionTooltipDefs } from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import { access, accessSignal } from "../../Utils/propUtils";
import type {
    SortableGridController,
    SortableGridItem,
    SortableGridItemSlotProps,
    SortableGridProps,
} from "./SortableGridSolid.types";

const SortableGridItemSlot = (props: SortableGridItemSlotProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <div
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            class={styles.sortableGridItem}
            role="listitem"
            aria-label={access(props.label)}
            aria-posinset={access(props.position)}
            aria-setsize={access(props.setSize)}
            aria-disabled={getIsDisabled() || undefined}
            aria-describedby={access(props.hintId)}
            onPointerDown={props.onPointerDown}
            onKeyDown={props.onKeyDown}
            onClick={props.onClick}
            onFocus={props.onFocus}
        >
            <Index each={access(props.cells)}>
                {(getCell) => (
                    <div
                        class={styles.sortableGridHit}
                        style={{
                            left: `${getCell().left}px`,
                            top: `${getCell().top}px`,
                            width: `${getCell().width}px`,
                            height: `${getCell().height}px`,
                        }}
                        aria-hidden="true"
                    />
                )}
            </Index>

            {props.renderContent(() => access(props.flags))}
        </div>
    );
};

export const SortableGrid = <T,>(props: SortableGridProps<T>) => {
    const itemsSignal = accessSignal(() => props.itemsSignal);

    const gridId = createUniqueId();
    const hintId = createUniqueId();

    const viewportContext = useViewportContext();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const itemRefs = new Map<number, HTMLElement>();
    const [getFocusedIndex, setFocusedIndex] = createSignal(0);
    const [getCarriedPoint, setCarriedPoint] = createSignal<Point2d | undefined>();

    let grabOffset: Point2d = { x: 0, y: 0 };

    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(() => access(props.ariaLabel));

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsLocked = createMemo(() => access(props.isLocked) ?? false);

    const getIsTurnable = createMemo(() => access(props.isTurnable) ?? false);

    const getColumns = createMemo(() => access(props.columns));

    const getRows = createMemo(() => access(props.rows));

    const getCellSize = createMemo(() => access(props.cellSize));

    const getGap = createMemo(() => access(props.gap) ?? SORTABLE_GRID_DEFAULTS.gap);

    const getItems = createMemo(() => itemsSignal[0]());

    const getGroupId = createMemo(() => access(props.groupId));

    const getCells = createMemo(() => SortableGridUtils.getSpots(getColumns(), getRows()));

    const getIsSpotBlocked = (spot: SortableGridSpot) => props.computeIsSpotBlocked?.(spot) ?? false;

    const getBlockedSpots = createMemo(() =>
        props.computeIsSpotBlocked === undefined ? [] : getCells().filter(getIsSpotBlocked),
    );

    const getSpan = (cells: number) => SortableGridUtils.getSpan(cells, getCellSize(), getGap());

    const getOffset = (cell: number) => SortableGridUtils.getOffset(cell, getCellSize(), getGap());

    const getExtent = (cells: number) => SortableGridUtils.getExtent(cells, getCellSize(), getGap());

    const getGeometry = (shape: SortableGridShape) => SortableGridUtils.getGeometry(shape, getCellSize(), getGap());

    const setItemRef = (index: number, element: HTMLElement) => {
        itemRefs.set(index, element);

        onCleanup(() => {
            if (itemRefs.get(index) === element) itemRefs.delete(index);
        });
    };

    const zone: CarrierZone = SortableGridUtils.createZone<T, InteractionTooltipDefs<SortableGridItemFlags>>({
        getZone: () => zone,
        getItems,
        updateItems: (update) => itemsSignal[1]((items) => update(items)),
        getGroupId,
        getLabel: () => access(props.ariaLabel),
        getRootRef,
        getIsDisabled,
        getIsLocked,
        getIsTurnable,
        getAnnouncements: () => access(props.announcements),
        getColumns,
        getRows,
        getCellSize,
        getGap,
        getScale: () => viewportContext.getScale(),
        getBlockedSpots,
        computeItemKey: props.computeItemKey,
        computeCanAccept: (value, fromLabel) => props.computeCanAccept?.(value, fromLabel) ?? true,
        onTransfer: (transfer) => props.onTransfer?.(transfer),
    });

    CarrierSolidUtils.registerZone(zone);

    const getIsSource = createMemo(() => CarrierSolidUtils.getSourceZone() === zone);

    const getIsReceiving = createMemo(() => CarrierSolidUtils.getTargetZone() === zone);

    const getCarriedKey = createMemo(() => (getIsSource() ? CarrierSolidUtils.getCarry()?.key : undefined));

    const turn = (step: number) => {
        if (!getIsTurnable() || !getIsSource()) return false;

        CarrierUtils.aimAtNudge({ turn: step });

        return true;
    };

    const compact = () =>
        untrack(() => {
            if (CarrierSolidUtils.getCarry() && (getIsSource() || getIsReceiving())) return false;

            const items = itemsSignal[0]();
            const compacted = SortableGridUtils.getCompacted(items, getBlockedSpots());

            if (compacted.every((item, index) => item === items[index])) return false;

            itemsSignal[1](compacted);

            return true;
        });

    const controller: SortableGridController = {
        getIsCarrying: getIsSource,
        turnCw: () => turn(1),
        turnCcw: () => turn(-1),
        compact,
    };

    const getLandingPlace = createMemo(() => {
        const place = CarrierSolidUtils.getTargetPlace();

        if (!getIsReceiving() || place === undefined) return;

        return place as SortableGridPlace;
    });

    const getLandingGeometry = createMemo(() => {
        const carry = CarrierSolidUtils.getCarry();
        const place = getLandingPlace();

        if (!carry || !place) return;

        return getGeometry(SortableGridUtils.getCarriedShape(carry, place.turns));
    });

    const getCarriedItem = () => CarrierSolidUtils.getCarry()?.value as SortableGridItem<T> | undefined;

    const getCarriedGeometry = createMemo(() => {
        const carry = CarrierSolidUtils.getCarry();

        if (!carry || !getIsSource()) return;

        return getGeometry(
            SortableGridUtils.getCarriedShape(
                carry,
                SortableGridUtils.getAimedTurns(carry, CarrierSolidUtils.getTargetPlace()),
            ),
        );
    });

    const getBoxes = createMemo(() => getItems().map(SortableGridUtils.getItemBox));

    const getNavigableIndexes = createMemo(() => SortableUtils.computeNavigableIndexes(getItems()));

    const getReadingOrder = createMemo(() => SortableGridUtils.getReadingOrder(getBoxes()));

    const getRovingIndex = createMemo(() => SortableUtils.computeRovingIndex(getNavigableIndexes(), getFocusedIndex()));

    const getItemId = (index: number) => `${gridId}-item-${index}`;

    const focusIndex = (index: number) => {
        setFocusedIndex(index);
        itemRefs.get(index)?.focus();
    };

    let hasPendingClick = false;

    const pickUp = (index: number, mode: CarryMode, from?: Point2d) => {
        if (getIsDisabled()) return;

        const item = getItems()[index];

        if (!item || item.isDisabled) return;

        const pickUpGeometry = SortableGridUtils.computePickUp(
            itemRefs.get(index)?.getBoundingClientRect(),
            viewportContext,
            SortableGridUtils.getItemShape(item),
            { cellSize: getCellSize(), gap: getGap(), from },
        );

        grabOffset = pickUpGeometry.grabOffset;
        setCarriedPoint(pickUpGeometry.point);

        SortableGridUtils.grab(zone, pickUpGeometry.grabSpot);

        CarrierUtils.start(
            zone,
            { ...item.spot, turns: item.turns ?? 0 },
            SortableUtils.computeCarry(
                item,
                getGroupId(),
                props.computeItemKey(item.value),
                props.computeItemLabel(item.value),
            ),
            mode,
        );
    };

    const handlePointerDown = (index: number) => (e: PointerEvent) => {
        if (e.button !== 0 || getIsDisabled()) return;
        if ((e.target as HTMLElement).closest(CarrierUtils.INTERACTIVE_SELECTOR)) return;
        if (CarrierSolidUtils.getCarry()) return;

        const element = itemRefs.get(index);

        if (!element) return;

        CarrierSolidUtils.dragFromPointer(
            element,
            e,
            (from) => pickUp(index, "drag", from),
            () => {
                hasPendingClick = true;
            },
        );
    };

    const handleClick = (index: number) => (e: MouseEvent) => {
        if (getIsDisabled()) return;
        if ((e.target as HTMLElement).closest(CarrierUtils.INTERACTIVE_SELECTOR)) return;

        const action = SortableUtils.computeClickAction(
            CarrierSolidUtils.getCarry() ? CarrierSolidUtils.getCarryMode() : undefined,
        );

        if (action === "pickUp") {
            pickUp(index, "tap", { x: e.clientX, y: e.clientY });
            focusIndex(index);

            return;
        }

        if (action === undefined) return;
        if (action === "aimAndDrop") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

        CarrierSolidUtils.end("drop");
    };

    const handleKeyDown = (index: number) => (e: KeyboardEvent) => {
        if (getIsDisabled()) return;

        const action = SortableGridUtils.computeKeyAction(e.key, {
            index,
            isShifted: e.shiftKey,
            isCarrying: CarrierSolidUtils.getCarry() !== undefined && CarrierSolidUtils.getCarryMode() !== "drag",
            navigable: getNavigableIndexes(),
            boxes: getBoxes(),
        });

        if (action === undefined) return;

        e.preventDefault();

        if (action.kind === "cancel") CarrierSolidUtils.end("cancel");
        if (action.kind === "drop") CarrierSolidUtils.end("drop");
        if (action.kind === "pickUp") pickUp(index, "key");
        if (action.kind === "aimAtNextZone") CarrierUtils.aimAtNextZone(action.step);
        if (action.kind === "nudge") CarrierUtils.aimAtNudge(action.nudge);
        if (action.kind === "focus") focusIndex(action.index);
    };

    const handleRootClick = (e: MouseEvent) => {
        const carry = CarrierSolidUtils.getCarry();

        if (getIsDisabled() || !carry) return;
        if (CarrierSolidUtils.getCarryMode() === "drag") return;
        if (e.target !== getRootRef()) return;
        if (!zone.computeCanAccept(carry) && !getIsSource()) return;

        if (CarrierSolidUtils.getCarryMode() === "key") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

        CarrierSolidUtils.end("drop");
    };

    createEffect(() => {
        if (!getIsSource()) {
            setCarriedPoint(undefined);

            return;
        }

        const trackPoint = (e: PointerEvent) => {
            setCarriedPoint(ViewportUtils.getAdjustedClientPoint({ x: e.clientX, y: e.clientY }, viewportContext));

            if (CarrierSolidUtils.getCarryMode() !== "tap") return;

            CarrierUtils.aimAtPoint(e.clientX, e.clientY);
        };

        document.addEventListener("pointermove", trackPoint, true);

        onCleanup(() => {
            document.removeEventListener("pointermove", trackPoint, true);
        });
    });

    createEffect(() => {
        const root = getRootRef();

        if (!root) return;

        const swallowClick = (e: MouseEvent) => {
            if (!hasPendingClick) return;

            hasPendingClick = false;

            e.preventDefault();
            e.stopPropagation();
        };

        root.addEventListener("click", swallowClick, true);

        onCleanup(() => {
            root.removeEventListener("click", swallowClick, true);
        });
    });

    createEffect(() => {
        const length = getItems().length;

        if (getFocusedIndex() < length) return;

        setFocusedIndex(Math.max(length - 1, 0));
    });

    createEffect(() => {
        if (!getIsDisabled() || !CarrierSolidUtils.getCarry()) return;
        if (CarrierSolidUtils.getSourceZone() !== zone) return;

        CarrierSolidUtils.end("cancel");
    });

    onCleanup(() => {
        if (CarrierSolidUtils.getSourceZone() === zone) CarrierSolidUtils.end("cancel");
    });

    onMount(() => {
        props.onMount?.(controller);
    });

    const renderGrid = () => (
        <InteractionWrapper
            {...props}
            extraFlags={() => ({
                isCarrying: CarrierSolidUtils.getCarry() !== undefined,
                isReceiving: getIsReceiving(),
                isSource: getIsSource(),
                isEmpty: getItems().length < 1,
            })}
            renderControl={(setElementRef) => (
                <div
                    id={gridId}
                    ref={(element) => {
                        setRootRef(element);
                        setElementRef(element);
                    }}
                    class={styles.sortableGridRoot}
                    style={{
                        width: `${getExtent(getColumns())}px`,
                        height: `${getExtent(getRows())}px`,
                    }}
                    role="list"
                    aria-label={getAriaLabel()}
                    aria-disabled={getIsDisabled() || undefined}
                    onClick={handleRootClick}
                >
                    <Show when={props.renderCell}>
                        <div
                            class={styles.sortableGridCells}
                            style={{
                                "left": `${getGap()}px`,
                                "top": `${getGap()}px`,
                                "gap": `${getGap()}px`,
                                "grid-template-columns": `repeat(${getColumns()}, ${getCellSize()}px)`,
                                "grid-auto-rows": `${getCellSize()}px`,
                            }}
                            aria-hidden="true"
                        >
                            <Index each={getCells()}>
                                {(getCell) => (
                                    <div class={styles.sortableGridCell}>
                                        {props.renderCell?.(getCell, () => ({
                                            isBlocked: getIsSpotBlocked(getCell()),
                                        }))}
                                    </div>
                                )}
                            </Index>
                        </div>
                    </Show>

                    <Index each={getItems()}>
                        {(getItem, index) => {
                            const getItemGeometry = createMemo(() =>
                                getGeometry(SortableGridUtils.getItemShape(getItem())),
                            );

                            return (
                                <div
                                    class={styles.sortableGridSlot}
                                    style={{
                                        left: `${getOffset(getItem().spot.col)}px`,
                                        top: `${getOffset(getItem().spot.row)}px`,
                                        width: `${getSpan(getItemGeometry().size.colCount)}px`,
                                        height: `${getSpan(getItemGeometry().size.rowCount)}px`,
                                    }}
                                >
                                    <InteractionWrapper
                                        sizing={() => "fill"}
                                        isDisabled={() => getItem().isDisabled ?? false}
                                        isReachableWhenDisabled={() => getItem().isReachableWhenDisabled ?? false}
                                        isTabbable={() => getRovingIndex() === index}
                                        tooltipDefs={() => getItem().tooltipDefs}
                                        extraFlags={() => ({
                                            isCarried: getCarriedKey() === props.computeItemKey(getItem().value),
                                        })}
                                        renderControl={(setItemElementRef, getItemFlags) => (
                                            <SortableGridItemSlot
                                                ref={(element) => {
                                                    setItemRef(index, element);
                                                    setItemElementRef(element);
                                                }}
                                                id={() => getItemId(index)}
                                                hintId={() => hintId}
                                                label={() =>
                                                    SortableGridUtils.computeItemLabel(
                                                        props.computeItemLabel(getItem().value),
                                                        getItem(),
                                                    )
                                                }
                                                position={() => getReadingOrder().indexOf(index) + 1}
                                                setSize={() => getItems().length}
                                                cells={() => getItemGeometry().cells}
                                                flags={getItemFlags}
                                                renderContent={(getContentFlags) =>
                                                    props.renderItem(getItem, getContentFlags, getItemGeometry)
                                                }
                                                onPointerDown={handlePointerDown(index)}
                                                onKeyDown={handleKeyDown(index)}
                                                onClick={handleClick(index)}
                                                onFocus={() => setFocusedIndex(index)}
                                            />
                                        )}
                                    />
                                </div>
                            );
                        }}
                    </Index>

                    <Show when={props.renderLanding && getLandingPlace()}>
                        {(getPlace) => (
                            <div
                                class={styles.sortableGridLanding}
                                style={{
                                    left: `${getOffset(getPlace().col)}px`,
                                    top: `${getOffset(getPlace().row)}px`,
                                    width: `${getSpan(getLandingGeometry()?.size.colCount ?? 1)}px`,
                                    height: `${getSpan(getLandingGeometry()?.size.rowCount ?? 1)}px`,
                                }}
                                aria-hidden="true"
                            >
                                <Show when={getLandingGeometry()}>
                                    {props.renderLanding?.(CarrierSolidUtils.getIsTargetAllowed, () =>
                                        getLandingGeometry()!,
                                    )}
                                </Show>
                            </div>
                        )}
                    </Show>
                    <div id={hintId} class={styles.sortableGridHint}>
                        {access(props.announcements).restingKeyHint}
                    </div>
                </div>
            )}
        />
    );

    const getCarriedZIndex = () => {
        const root = getRootRef();

        return Math.max(AnchorUtils.getStackingBase(root), ElevationSolidUtils.getBase(root)) + 1;
    };

    return (
        <>
            {renderGrid()}

            <Show when={props.renderCarried && getIsSource() && getCarriedPoint()}>
                {(getPoint: () => Point2d) => (
                    <Portal mount={viewportContext.getPortalRef()}>
                        <div
                            class={styles.sortableGridCarried}
                            style={{
                                "transform": `translate(${getPoint().x - grabOffset.x}px, ${getPoint().y - grabOffset.y}px)`,
                                "width": `${getSpan(getCarriedGeometry()?.size.colCount ?? 1)}px`,
                                "height": `${getSpan(getCarriedGeometry()?.size.rowCount ?? 1)}px`,
                                "z-index": getCarriedZIndex(),
                            }}
                            aria-hidden="true"
                        >
                            <Show when={getCarriedItem() && getCarriedGeometry()}>
                                {props.renderCarried?.(
                                    () => getCarriedItem()!,
                                    () => getCarriedGeometry()!,
                                )}
                            </Show>
                        </div>
                    </Portal>
                )}
            </Show>
        </>
    );
};
