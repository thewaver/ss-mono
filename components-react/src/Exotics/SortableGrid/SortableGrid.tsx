import {
    type KeyboardEvent,
    type MouseEvent,
    type PointerEvent,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

import {
    AnchorUtils,
    CarrierUtils,
    type CarrierZone,
    type CarryMode,
    SORTABLE_GRID_DEFAULTS,
    type SortableGridFlags,
    type SortableGridItemFlags,
    type SortableGridPlace,
    type SortableGridShape,
    type SortableGridSpot,
    SortableGridStyles,
    SortableGridUtils,
    SortableUtils,
    ViewportUtils,
} from "@thewaver/ss-components";
import { type Point2d, StoreUtils } from "@thewaver/ss-utils";

import { CarrierReactUtils } from "../../Abstracts/Carrier/CarrierReact.utils";
import { ElevationReactUtils } from "../../Abstracts/Elevation/ElevationReact.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { LabelReactUtils } from "../../Essentials/Input/Label/LabelReact.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionTooltipDefs } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { useElement, useLatest } from "../../Utils/refUtils";
import type {
    SortableGridController,
    SortableGridItem,
    SortableGridItemSlotProps,
    SortableGridProps,
} from "./SortableGrid.types";

const NO_BLOCKED_SPOTS: SortableGridSpot[] = [];

const SortableGridItemSlot = (props: SortableGridItemSlotProps) => {
    const isDisabled = props.flags.isDisabled ?? false;

    return (
        <div
            id={props.id}
            ref={props.ref}
            className={SortableGridStyles.sortableGridItem}
            role="listitem"
            aria-label={props.label}
            aria-posinset={props.position}
            aria-setsize={props.setSize}
            aria-disabled={isDisabled || undefined}
            aria-describedby={props.hintId}
            onPointerDown={props.onPointerDown}
            onKeyDown={props.onKeyDown}
            onClick={props.onClick}
            onFocus={props.onFocus}
        >
            {props.cells.map((cell, index) => (
                <div
                    key={index}
                    className={SortableGridStyles.sortableGridHit}
                    style={{
                        left: `${cell.left}px`,
                        top: `${cell.top}px`,
                        width: `${cell.width}px`,
                        height: `${cell.height}px`,
                    }}
                    aria-hidden="true"
                />
            ))}

            {props.renderContent(props.flags)}
        </div>
    );
};

export const SortableGrid = <T,>(props: SortableGridProps<T>) => {
    const [items, setItems] = props.items;

    const gridId = useId();
    const hintId = useId();

    const viewportContext = useViewportContext();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<Array<HTMLElement | undefined>>([]);
    const grabOffsetRef = useRef<Point2d>({ x: 0, y: 0 });
    const hasPendingClickRef = useRef(false);

    const itemsRef = useRef(items);

    const rootElement = useElement(rootRef);

    useLayoutEffect(() => {
        itemsRef.current = items;
    }, [items]);

    const writeItems = (next: SortableGridItem<T>[]) => {
        itemsRef.current = next;
        setItems(next);
    };

    const [focusedIndex, setFocusedIndex] = useState(0);
    const [carriedPoint, setCarriedPoint] = useState<Point2d>();

    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);

    const isDisabled = props.isDisabled ?? false;
    const isLocked = props.isLocked ?? false;
    const isTurnable = props.isTurnable ?? false;
    const gap = props.gap ?? SORTABLE_GRID_DEFAULTS.gap;
    const { columns, rows, cellSize } = props;

    const carryState = CarrierReactUtils.useCarry();
    const isTargetAllowed = CarrierReactUtils.useIsTargetAllowed();

    const cells = SortableGridUtils.getSpots(columns, rows);
    const computeIsSpotBlocked = props.computeIsSpotBlocked;
    const blockedSpots =
        computeIsSpotBlocked === undefined ? NO_BLOCKED_SPOTS : cells.filter((spot) => computeIsSpotBlocked(spot));

    const getSpan = (count: number) => SortableGridUtils.getSpan(count, cellSize, gap);
    const getOffset = (cell: number) => SortableGridUtils.getOffset(cell, cellSize, gap);
    const getGeometry = (shape: SortableGridShape) => SortableGridUtils.getGeometry(shape, cellSize, gap);

    const zone: CarrierZone = CarrierReactUtils.useZone(
        SortableGridUtils.createZone<T, InteractionTooltipDefs<SortableGridItemFlags>>({
            getZone: () => zone,
            getItems: () => items,
            updateItems: (update) => writeItems(update(itemsRef.current)),
            getGroupId: () => props.groupId,
            getLabel: () => props.ariaLabel,
            getRootRef: () => rootRef.current ?? undefined,
            getIsDisabled: () => isDisabled,
            getIsLocked: () => isLocked,
            getIsTurnable: () => isTurnable,
            getAnnouncements: () => props.announcements,
            getColumns: () => columns,
            getRows: () => rows,
            getCellSize: () => cellSize,
            getGap: () => gap,
            getScale: () => viewportContext.getScale(),
            getBlockedSpots: () => blockedSpots,
            computeItemKey: props.computeItemKey,
            computeCanAccept: (value, fromLabel) => props.computeCanAccept?.(value, fromLabel) ?? true,
            onTransfer: (transfer) => props.onTransfer?.(transfer),
        }),
    );

    const isSource = carryState !== undefined && carryState.from === zone;
    const isReceiving = carryState !== undefined && carryState.to === zone;
    const carriedKey = isSource ? carryState.carry.key : undefined;

    const latest = useLatest({ writeItems, blockedSpots, isTurnable, isSource, isReceiving });

    const [controllerStore] = useState(() => StoreUtils.create(isSource));

    useLayoutEffect(() => {
        controllerStore.set(isSource);
    });

    const [controller] = useState<SortableGridController>(() => {
        const turn = (step: number) => {
            if (!latest.current.isTurnable || !latest.current.isSource) return false;

            CarrierUtils.aimAtNudge({ turn: step });

            return true;
        };

        return {
            getIsCarrying: controllerStore.get,
            turnCw: () => turn(1),
            turnCcw: () => turn(-1),
            compact: () => {
                const current = latest.current;

                if (CarrierUtils.getCarry() && (current.isSource || current.isReceiving)) return false;

                const items = itemsRef.current;
                const compacted = SortableGridUtils.getCompacted(items, current.blockedSpots);

                if (compacted.every((item, index) => item === items[index])) return false;

                current.writeItems(compacted);

                return true;
            },
            subscribe: controllerStore.subscribe,
        };
    });

    const landingPlace = isReceiving ? (carryState.toPlace as SortableGridPlace) : undefined;
    const landingGeometry =
        carryState && landingPlace
            ? getGeometry(SortableGridUtils.getCarriedShape(carryState.carry, landingPlace.turns))
            : undefined;

    const carriedItem = carryState?.carry.value as SortableGridItem<T> | undefined;
    const carriedGeometry =
        carryState && isSource
            ? getGeometry(
                  SortableGridUtils.getCarriedShape(
                      carryState.carry,
                      SortableGridUtils.getAimedTurns(carryState.carry, carryState.toPlace),
                  ),
              )
            : undefined;

    const boxes = items.map(SortableGridUtils.getItemBox);
    const navigable = SortableUtils.computeNavigableIndexes(items);
    const readingOrder = SortableGridUtils.getReadingOrder(boxes);
    const rovingIndex = SortableUtils.computeRovingIndex(navigable, focusedIndex);

    const getItemId = (index: number) => `${gridId}-item-${index}`;

    const focusIndex = (index: number) => {
        setFocusedIndex(index);
        itemRefs.current[index]?.focus();
    };

    const pickUp = (index: number, mode: CarryMode, from?: Point2d) => {
        if (isDisabled) return;

        const item = items[index];

        if (!item || item.isDisabled) return;

        const pickUpGeometry = SortableGridUtils.computePickUp(
            itemRefs.current[index]?.getBoundingClientRect(),
            viewportContext,
            SortableGridUtils.getItemShape(item),
            { cellSize, gap, from },
        );

        grabOffsetRef.current = pickUpGeometry.grabOffset;
        setCarriedPoint(pickUpGeometry.point);

        SortableGridUtils.grab(zone, pickUpGeometry.grabSpot);

        CarrierUtils.start(
            zone,
            { ...item.spot, turns: item.turns ?? 0 } satisfies SortableGridPlace,
            SortableUtils.computeCarry(
                item,
                props.groupId,
                props.computeItemKey(item.value),
                props.computeItemLabel(item.value),
            ),
            mode,
        );
    };

    const handlePointerDown = (index: number) => (e: PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0 || isDisabled) return;
        if ((e.target as HTMLElement).closest(CarrierUtils.INTERACTIVE_SELECTOR)) return;
        if (CarrierUtils.getCarry()) return;

        const element = itemRefs.current[index];

        if (!element) return;

        CarrierUtils.dragFromPointer(
            element,
            e.nativeEvent,
            (from) => pickUp(index, "drag", from),
            () => {
                hasPendingClickRef.current = true;
            },
        );
    };

    const handleClick = (index: number) => (e: MouseEvent<HTMLDivElement>) => {
        if (isDisabled) return;
        if ((e.target as HTMLElement).closest(CarrierUtils.INTERACTIVE_SELECTOR)) return;

        const action = SortableUtils.computeClickAction(
            CarrierUtils.getCarry() ? CarrierUtils.getCarryMode() : undefined,
        );

        if (action === "pickUp") {
            pickUp(index, "tap", { x: e.clientX, y: e.clientY });
            focusIndex(index);

            return;
        }

        if (action === undefined) return;
        if (action === "aimAndDrop") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

        CarrierUtils.end("drop");
    };

    const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLDivElement>) => {
        if (isDisabled) return;

        const action = SortableGridUtils.computeKeyAction(e.key, {
            index,
            isShifted: e.shiftKey,
            isCarrying: CarrierUtils.getCarry() !== undefined && CarrierUtils.getCarryMode() !== "drag",
            navigable,
            boxes,
        });

        if (action === undefined) return;

        e.preventDefault();

        if (action.kind === "cancel") CarrierUtils.end("cancel");
        if (action.kind === "drop") CarrierUtils.end("drop");
        if (action.kind === "pickUp") pickUp(index, "key");
        if (action.kind === "aimAtNextZone") CarrierUtils.aimAtNextZone(action.step);
        if (action.kind === "nudge") CarrierUtils.aimAtNudge(action.nudge);
        if (action.kind === "focus") focusIndex(action.index);
    };

    const handleRootClick = (e: MouseEvent<HTMLDivElement>) => {
        const carry = CarrierUtils.getCarry();

        if (isDisabled || !carry) return;
        if (CarrierUtils.getCarryMode() === "drag") return;
        if (e.target !== rootRef.current) return;
        if (!zone.computeCanAccept(carry) && !isSource) return;

        if (CarrierUtils.getCarryMode() === "key") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

        CarrierUtils.end("drop");
    };

    useEffect(() => {
        if (!isSource) {
            setCarriedPoint(undefined);

            return;
        }

        const trackPoint = (e: globalThis.PointerEvent) => {
            setCarriedPoint(ViewportUtils.getAdjustedClientPoint({ x: e.clientX, y: e.clientY }, viewportContext));

            if (CarrierUtils.getCarryMode() !== "tap") return;

            CarrierUtils.aimAtPoint(e.clientX, e.clientY);
        };

        document.addEventListener("pointermove", trackPoint, true);

        return () => document.removeEventListener("pointermove", trackPoint, true);
    }, [isSource, viewportContext]);

    useEffect(() => {
        if (!rootElement) return;

        const swallowClick = (e: globalThis.MouseEvent) => {
            if (!hasPendingClickRef.current) return;

            hasPendingClickRef.current = false;

            e.preventDefault();
            e.stopPropagation();
        };

        rootElement.addEventListener("click", swallowClick, true);

        return () => rootElement.removeEventListener("click", swallowClick, true);
    }, [rootElement]);

    useEffect(() => {
        if (focusedIndex < items.length) return;

        setFocusedIndex(Math.max(items.length - 1, 0));
    }, [focusedIndex, items.length]);

    useEffect(() => {
        if (!isDisabled || !isSource) return;

        CarrierUtils.end("cancel");
    }, [isDisabled, isSource]);

    useEffect(
        () => () => {
            if (CarrierUtils.getSourceZone() === zone) CarrierUtils.end("cancel");
        },
        [zone],
    );

    useEffect(() => {
        props.onMount?.(controller);
    }, [controller]);

    const elevationBase = ElevationReactUtils.useBase(rootElement);

    const grid = (
        <InteractionWrapper<SortableGridFlags>
            {...props}
            extraFlags={{
                isCarrying: carryState !== undefined,
                isReceiving,
                isSource,
                isEmpty: items.length < 1,
            }}
            renderControl={(setElementRef) => (
                <div
                    id={gridId}
                    ref={(element) => {
                        rootRef.current = element;
                        setElementRef(element);
                    }}
                    className={SortableGridStyles.sortableGridRoot}
                    style={{
                        width: `${SortableGridUtils.getExtent(columns, cellSize, gap)}px`,
                        height: `${SortableGridUtils.getExtent(rows, cellSize, gap)}px`,
                    }}
                    role="list"
                    aria-label={ariaLabel}
                    aria-disabled={isDisabled || undefined}
                    onClick={handleRootClick}
                >
                    {props.renderCell && (
                        <div
                            className={SortableGridStyles.sortableGridCells}
                            style={{
                                left: `${gap}px`,
                                top: `${gap}px`,
                                gap: `${gap}px`,
                                gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
                                gridAutoRows: `${cellSize}px`,
                            }}
                            aria-hidden="true"
                        >
                            {cells.map((spot, index) => (
                                <div key={index} className={SortableGridStyles.sortableGridCell}>
                                    {props.renderCell?.(spot, { isBlocked: computeIsSpotBlocked?.(spot) ?? false })}
                                </div>
                            ))}
                        </div>
                    )}

                    {items.map((item, index) => {
                        const geometry = getGeometry(SortableGridUtils.getItemShape(item));

                        return (
                            <div
                                key={index}
                                className={SortableGridStyles.sortableGridSlot}
                                style={{
                                    left: `${getOffset(item.spot.col)}px`,
                                    top: `${getOffset(item.spot.row)}px`,
                                    width: `${getSpan(geometry.size.colCount)}px`,
                                    height: `${getSpan(geometry.size.rowCount)}px`,
                                }}
                            >
                                <InteractionWrapper<SortableGridItemFlags>
                                    sizing={"fill"}
                                    isDisabled={item.isDisabled ?? false}
                                    isReachableWhenDisabled={item.isReachableWhenDisabled ?? false}
                                    isTabbable={rovingIndex === index}
                                    tooltipDefs={item.tooltipDefs}
                                    extraFlags={{ isCarried: carriedKey === props.computeItemKey(item.value) }}
                                    renderControl={(setItemElementRef, itemFlags) => (
                                        <SortableGridItemSlot
                                            ref={(element) => {
                                                itemRefs.current[index] = element ?? undefined;
                                                setItemElementRef(element);
                                            }}
                                            id={getItemId(index)}
                                            hintId={hintId}
                                            label={SortableGridUtils.computeItemLabel(
                                                props.computeItemLabel(item.value),
                                                item,
                                            )}
                                            position={readingOrder.indexOf(index) + 1}
                                            setSize={items.length}
                                            cells={geometry.cells}
                                            flags={itemFlags}
                                            renderContent={(contentFlags) =>
                                                props.renderItem(item, contentFlags, geometry)
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
                    })}

                    {props.renderLanding && landingPlace && (
                        <div
                            className={SortableGridStyles.sortableGridLanding}
                            style={{
                                left: `${getOffset(landingPlace.col)}px`,
                                top: `${getOffset(landingPlace.row)}px`,
                                width: `${getSpan(landingGeometry?.size.colCount ?? 1)}px`,
                                height: `${getSpan(landingGeometry?.size.rowCount ?? 1)}px`,
                            }}
                            aria-hidden="true"
                        >
                            {landingGeometry && props.renderLanding(isTargetAllowed, landingGeometry)}
                        </div>
                    )}
                    <div id={hintId} className={SortableGridStyles.sortableGridHint}>
                        {props.announcements.restingKeyHint}
                    </div>
                </div>
            )}
        />
    );

    const carriedZIndex = Math.max(AnchorUtils.getStackingBase(rootElement), elevationBase) + 1;

    return (
        <>
            {grid}

            {props.renderCarried &&
                isSource &&
                carriedPoint &&
                createPortal(
                    <div
                        className={SortableGridStyles.sortableGridCarried}
                        style={{
                            transform: `translate(${carriedPoint.x - grabOffsetRef.current.x}px, ${carriedPoint.y - grabOffsetRef.current.y}px)`,
                            width: `${getSpan(carriedGeometry?.size.colCount ?? 1)}px`,
                            height: `${getSpan(carriedGeometry?.size.rowCount ?? 1)}px`,
                            zIndex: carriedZIndex,
                        }}
                        aria-hidden="true"
                    >
                        {carriedItem && carriedGeometry && props.renderCarried(carriedItem, carriedGeometry)}
                    </div>,
                    viewportContext.getPortalRef() ?? document.body,
                )}
        </>
    );
};
