import { Index, Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";

import type { Point2d } from "@thewaver/ss-utils";

import { AnchorUtils } from "../../Abstracts/Anchor/Anchor.utils";
import type { CarrierZone, Carry, CarryMode, CarryNudge, CarryPlace } from "../../Abstracts/Carrier/Carrier.types";
import { CarrierStack } from "../../Abstracts/Carrier/CarrierStack";
import { Elevation } from "../../Abstracts/Elevation/Elevation";
import { InteractionTracker } from "../../Abstracts/InteractionTracker/InteractionTracker";
import { LabelUtils } from "../../Fundamentals/Input/Label/Label.utils";
import { InteractionWrapper } from "../../Fundamentals/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../Utils/propUtils";
import { useViewportContext } from "../Viewport/Viewport.context";
import { ViewportUtils } from "../Viewport/Viewport.utils";
import type {
    SortableGridController,
    SortableGridGeometry,
    SortableGridItem,
    SortableGridItemSlotProps,
    SortableGridPlace,
    SortableGridProps,
    SortableGridShape,
    SortableGridSpot,
} from "./SortableGrid.types";
import { SortableGridUtils } from "./SortableGrid.utils";

import * as styles from "./SortableGrid.css";

const DEFAULT_SORTABLE_GRID_GAP = 0;
const DEFAULT_SORTABLE_GRID_FOOTPRINT = { width: 1, height: 1 };
const FIRST_SPOT: SortableGridSpot = { x: 0, y: 0 };

const NUDGE_KEYS: Record<string, CarryNudge | undefined> = {
    ArrowRight: { x: 1 },
    ArrowLeft: { x: -1 },
    ArrowDown: { y: 1 },
    ArrowUp: { y: -1 },
};

const STEP_KEYS: Record<string, Point2d | undefined> = {
    ArrowRight: { x: 1, y: 0 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowDown: { x: 0, y: 1 },
    ArrowUp: { x: 0, y: -1 },
};

const INTERACTIVE_SELECTOR =
    "a[href], button, input, select, textarea, [role='button'], [role='checkbox'], [role='link'], [role='switch']";

let grabbed: { zone: CarrierZone; spot: SortableGridSpot } | undefined;

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

    const viewportContext = useViewportContext();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getItemRefs, setItemRefs] = createSignal<Array<HTMLElement | undefined>>([]);
    const [getFocusedIndex, setFocusedIndex] = createSignal(0);
    const [getCarriedPoint, setCarriedPoint] = createSignal<Point2d | undefined>();

    let grabOffset: Point2d = { x: 0, y: 0 };

    const getAriaLabel = LabelUtils.resolveAriaLabel(() => access(props.ariaLabel));

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsLocked = createMemo(() => access(props.isLocked) ?? false);

    const getIsTurnable = createMemo(() => access(props.isTurnable) ?? false);

    const getColumns = createMemo(() => access(props.columns));

    const getRows = createMemo(() => access(props.rows));

    const getCellSize = createMemo(() => access(props.cellSize));

    const getGap = createMemo(() => access(props.gap) ?? DEFAULT_SORTABLE_GRID_GAP);

    const getPitch = createMemo(() => getCellSize() + getGap());

    const getItems = createMemo(() => itemsSignal[0]());

    const getGroupId = createMemo(() => access(props.groupId));

    const getSpan = (cells: number) => cells * getPitch() - getGap();

    const getOffset = (cell: number) => getGap() + cell * getPitch();

    const getExtent = (cells: number) => getGap() * 2 + getSpan(cells);

    const getGeometry = (shape: SortableGridShape): SortableGridGeometry => {
        const block = SortableGridUtils.getBlock(shape.cells);

        return {
            size: shape.size,
            cells: SortableGridUtils.getCellRects(shape.cells, getCellSize(), getGap()),
            block: {
                spot: block.spot,
                left: block.spot.x * getPitch(),
                top: block.spot.y * getPitch(),
                width: getSpan(block.size.width),
                height: getSpan(block.size.height),
            },
            outline: SortableGridUtils.getOutline(shape.cells, getCellSize(), getGap()),
        };
    };

    const setItemRef = (index: number, element: HTMLElement | undefined) => {
        setItemRefs((refs) => {
            const next = [...refs];

            next[index] = element;

            return next;
        });
    };

    const computeCarry = (item: SortableGridItem<T>): Carry => ({
        groupId: getGroupId(),
        key: props.computeItemKey(item.value),
        label: props.computeItemLabel(item.value),
        value: item,
    });

    const asPlace = (place: CarryPlace) => place as SortableGridPlace;

    const asItem = (carry: Carry) => carry.value as SortableGridItem<T>;

    const getCarriedShape = (carry: Carry, turns: number) =>
        SortableGridUtils.getShape(asItem(carry).footprint ?? DEFAULT_SORTABLE_GRID_FOOTPRINT, turns);

    const getAimedTurns = (carry: Carry) => {
        const place = CarrierStack.getTargetPlace();

        return SortableGridUtils.getIsPlace(place) ? place.turns : (asItem(carry).turns ?? 0);
    };

    const getGrabSpot = (shape: SortableGridShape) => {
        if (!grabbed || grabbed.zone !== CarrierStack.getSourceZone()) return FIRST_SPOT;

        return {
            x: Math.min(grabbed.spot.x, shape.size.width - 1),
            y: Math.min(grabbed.spot.y, shape.size.height - 1),
        };
    };

    const getTakenCells = (carry: Carry) =>
        getItems()
            .filter((item) => props.computeItemKey(item.value) !== carry.key)
            .flatMap(SortableGridUtils.getItemCells);

    const zone: CarrierZone = {
        getGroupId,
        getLabel: () => access(props.ariaLabel),
        getRootRef,
        getIsDisabled,
        getKeyHint: (hasOtherZones) =>
            hasOtherZones
                ? "Arrow keys move it, Tab changes grid, Enter drops, Escape cancels."
                : "Arrow keys move it, Enter drops, Escape cancels.",
        computeCanAccept: (carry) => {
            if (getIsDisabled() || getIsLocked()) return false;

            return (
                props.computeCanAccept?.(asItem(carry).value, CarrierStack.getSourceZone()?.getLabel() ?? "") ?? true
            );
        },
        computePlaceAtPoint: (point, carry) => {
            const root = getRootRef();

            if (!root) return;

            const turns = getAimedTurns(carry);
            const shape = getCarriedShape(carry, turns);
            const rect = root.getBoundingClientRect();
            const scale = viewportContext.getScale();
            const grab = getGrabSpot(shape);
            const cell = {
                x: Math.floor(((point.x - rect.left) / scale - getGap()) / getPitch()) - grab.x,
                y: Math.floor(((point.y - rect.top) / scale - getGap()) / getPitch()) - grab.y,
            };

            return { ...SortableGridUtils.getClampedSpot(cell, shape.size, getColumns(), getRows()), turns };
        },
        computeNudgedPlace: (place, nudge, carry) => {
            const current = asPlace(place);
            const turns = nudge.turn && getIsTurnable() ? current.turns + nudge.turn : current.turns;
            const shape = getCarriedShape(carry, turns);
            const spot = SortableGridUtils.getClampedSpot(
                { x: current.x + (nudge.x ?? 0), y: current.y + (nudge.y ?? 0) },
                shape.size,
                getColumns(),
                getRows(),
            );

            return { ...spot, turns };
        },
        computeEntryPlace: (carry) => {
            const item = asItem(carry);
            const turns = item.turns ?? 0;

            if (CarrierStack.getSourceZone() === zone) return { ...item.spot, turns };

            const shape = getCarriedShape(carry, turns);
            const spot = SortableGridUtils.getFreeSpot(shape, getColumns(), getRows(), getTakenCells(carry));

            return { ...(spot ?? FIRST_SPOT), turns };
        },
        computeIsSamePlace: (first, second) =>
            asPlace(first).x === asPlace(second).x &&
            asPlace(first).y === asPlace(second).y &&
            asPlace(first).turns === asPlace(second).turns,
        computeIsPlaceAllowed: (place, carry) => {
            const current = asPlace(place);
            const shape = getCarriedShape(carry, current.turns);

            return (
                SortableGridUtils.getIsInside(current, shape.size, getColumns(), getRows()) &&
                SortableGridUtils.getIsFree(
                    SortableGridUtils.getPlacedCells({ x: current.x, y: current.y }, shape),
                    getTakenCells(carry),
                )
            );
        },
        computePlaceLabel: (place, carry) => {
            const current = asPlace(place);
            const room = zone.computeIsPlaceAllowed(place, carry) ? "" : ", no room";

            return `column ${current.x + 1}, row ${current.y + 1}${room}`;
        },
        takeAt: (_unused, carry) => {
            itemsSignal[1]((items) => items.filter((item) => props.computeItemKey(item.value) !== carry.key));
        },
        putAt: (place, carry, origin) => {
            const current = asPlace(place);
            const item = asItem(carry);
            const placed: SortableGridItem<T> = {
                ...item,
                spot: { x: current.x, y: current.y },
                footprint: item.footprint ?? DEFAULT_SORTABLE_GRID_FOOTPRINT,
                turns: current.turns,
            };

            itemsSignal[1]((items) => [...items, placed]);

            props.onTransfer?.({
                value: item.value,
                fromLabel: origin.label,
                toLabel: access(props.ariaLabel),
                fromSpot: SortableGridUtils.getIsPlace(origin.place)
                    ? { x: origin.place.x, y: origin.place.y }
                    : undefined,
                toSpot: placed.spot,
            });
        },
        moveAt: (fromPlace, toPlace, carry) => {
            const current = asPlace(toPlace);

            let moved: SortableGridItem<T> | undefined;

            itemsSignal[1]((items) =>
                items.map((item) => {
                    if (props.computeItemKey(item.value) !== carry.key) return item;

                    moved = { ...item, spot: { x: current.x, y: current.y }, turns: current.turns };

                    return moved;
                }),
            );

            if (!moved) return;

            props.onTransfer?.({
                value: moved.value,
                fromLabel: access(props.ariaLabel),
                toLabel: access(props.ariaLabel),
                fromSpot: SortableGridUtils.getIsPlace(fromPlace) ? { x: fromPlace.x, y: fromPlace.y } : undefined,
                toSpot: moved.spot,
            });
        },
    };

    CarrierStack.registerZone(zone);

    const getIsSource = createMemo(() => CarrierStack.getSourceZone() === zone);

    const getIsReceiving = createMemo(() => CarrierStack.getTargetZone() === zone);

    const getCarriedKey = createMemo(() => (getIsSource() ? CarrierStack.getCarry()?.key : undefined));

    const turn = (step: number) => {
        if (!getIsTurnable() || !getIsSource()) return;

        CarrierStack.aimAtNudge({ turn: step });
    };

    const controller: SortableGridController = {
        getIsCarrying: getIsSource,
        turnCw: () => turn(1),
        turnCcw: () => turn(-1),
    };

    const getLandingPlace = createMemo(() => {
        const place = CarrierStack.getTargetPlace();

        if (!getIsReceiving() || place === undefined) return;

        return asPlace(place);
    });

    const getLandingGeometry = createMemo(() => {
        const carry = CarrierStack.getCarry();
        const place = getLandingPlace();

        if (!carry || !place) return;

        return getGeometry(getCarriedShape(carry, place.turns));
    });

    const getCarriedItem = () => CarrierStack.getCarry()?.value as SortableGridItem<T> | undefined;

    const getCarriedGeometry = createMemo(() => {
        const carry = CarrierStack.getCarry();

        if (!carry || !getIsSource()) return;

        return getGeometry(getCarriedShape(carry, getAimedTurns(carry)));
    });

    const getBoxes = createMemo(() => getItems().map(SortableGridUtils.getItemBox));

    const getNavigableIndexes = createMemo(() =>
        getItems().reduce<number[]>((acc, item, index) => {
            const isReachable = InteractionTracker.computeIsReachable(
                item.isDisabled ?? false,
                item.isReachableWhenDisabled ?? false,
                item.tooltipDefs !== undefined,
            );

            if (!item.isDisabled || isReachable) acc.push(index);

            return acc;
        }, []),
    );

    const getReadingOrder = createMemo(() => SortableGridUtils.getReadingOrder(getBoxes()));

    const getRovingIndex = createMemo(() => {
        const navigable = getNavigableIndexes();

        return navigable.includes(getFocusedIndex()) ? getFocusedIndex() : navigable[0];
    });

    const getItemId = (index: number) => `${gridId}-item-${index}`;

    const getItemLabel = (item: SortableGridItem<T>) => {
        const size = SortableGridUtils.getItemShape(item).size;

        return `${props.computeItemLabel(item.value)}, ${size.width} by ${size.height}, column ${item.spot.x + 1}, row ${item.spot.y + 1}`;
    };

    const focusIndex = (index: number) => {
        setFocusedIndex(index);
        getItemRefs()[index]?.focus();
    };

    let hasPendingClick = false;

    const pickUp = (index: number, mode: CarryMode, from?: Point2d) => {
        if (getIsDisabled()) return;

        const item = getItems()[index];

        if (!item || item.isDisabled) return;

        const rect = getItemRefs()[index]?.getBoundingClientRect();
        const shape = SortableGridUtils.getItemShape(item);

        if (rect) {
            const origin = ViewportUtils.getAdjustedClientPoint({ x: rect.left, y: rect.top }, viewportContext);
            const point = from && ViewportUtils.getAdjustedClientPoint(from, viewportContext);

            grabOffset = point
                ? { x: point.x - origin.x, y: point.y - origin.y }
                : { x: getSpan(shape.size.width) / 2, y: getSpan(shape.size.height) / 2 };

            setCarriedPoint(from ? ViewportUtils.getAdjustedClientPoint(from, viewportContext) : undefined);
        } else {
            grabOffset = { x: 0, y: 0 };
        }

        grabbed = {
            zone,
            spot: {
                x: Math.min(Math.floor(grabOffset.x / getPitch()), shape.size.width - 1),
                y: Math.min(Math.floor(grabOffset.y / getPitch()), shape.size.height - 1),
            },
        };

        CarrierStack.start(zone, { ...item.spot, turns: item.turns ?? 0 }, computeCarry(item), mode);
    };

    const handlePointerDown = (index: number) => (e: PointerEvent) => {
        if (e.button !== 0 || getIsDisabled()) return;
        if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;
        if (CarrierStack.getCarry()) return;

        const element = getItemRefs()[index];

        if (!element) return;

        CarrierStack.dragFromPointer(
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
        if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;

        const carry = CarrierStack.getCarry();

        if (!carry) {
            pickUp(index, "tap", { x: e.clientX, y: e.clientY });
            focusIndex(index);

            return;
        }

        if (CarrierStack.getCarryMode() === "drag") return;

        if (CarrierStack.getCarryMode() === "key") CarrierStack.aimAtPoint(e.clientX, e.clientY);

        CarrierStack.end("drop");
    };

    const handleKeyDown = (index: number) => (e: KeyboardEvent) => {
        if (getIsDisabled()) return;

        const isCarrying = CarrierStack.getCarry() !== undefined && CarrierStack.getCarryMode() !== "drag";

        if (e.key === "Escape") {
            if (!isCarrying) return;

            e.preventDefault();
            CarrierStack.end("cancel");

            return;
        }

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();

            if (isCarrying) {
                CarrierStack.end("drop");

                return;
            }

            pickUp(index, "key");

            return;
        }

        if (isCarrying && e.key === "Tab") {
            e.preventDefault();
            CarrierStack.aimAtNextZone(e.shiftKey ? -1 : 1);

            return;
        }

        if (isCarrying) {
            const nudge = NUDGE_KEYS[e.key];

            if (!nudge) return;

            e.preventDefault();
            CarrierStack.aimAtNudge(nudge);

            return;
        }

        const navigable = getNavigableIndexes();

        if (navigable.length < 1) return;

        if (e.key === "Home" || e.key === "End") {
            const reading = getReadingOrder().filter((entry) => navigable.includes(entry));

            e.preventDefault();
            focusIndex(e.key === "Home" ? reading[0] : reading[reading.length - 1]);

            return;
        }

        const step = STEP_KEYS[e.key];

        if (!step) return;

        e.preventDefault();

        const next = SortableGridUtils.getNeighbourIndex(
            navigable.map((entry) => getBoxes()[entry]),
            navigable.indexOf(index),
            step,
        );

        if (next === undefined) return;

        focusIndex(navigable[next]);
    };

    const handleRootClick = (e: MouseEvent) => {
        const carry = CarrierStack.getCarry();

        if (getIsDisabled() || !carry) return;
        if (CarrierStack.getCarryMode() === "drag") return;
        if (e.target !== getRootRef()) return;
        if (!zone.computeCanAccept(carry) && !getIsSource()) return;

        if (CarrierStack.getCarryMode() === "key") CarrierStack.aimAtPoint(e.clientX, e.clientY);

        CarrierStack.end("drop");
    };

    createEffect(() => {
        if (!getIsSource()) {
            setCarriedPoint(undefined);

            return;
        }

        const trackPoint = (e: PointerEvent) => {
            setCarriedPoint(ViewportUtils.getAdjustedClientPoint({ x: e.clientX, y: e.clientY }, viewportContext));

            if (CarrierStack.getCarryMode() !== "tap") return;

            CarrierStack.aimAtPoint(e.clientX, e.clientY);
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
        if (!getIsDisabled() || !CarrierStack.getCarry()) return;
        if (CarrierStack.getSourceZone() !== zone) return;

        CarrierStack.end("cancel");
    });

    onCleanup(() => {
        if (CarrierStack.getSourceZone() === zone) CarrierStack.end("cancel");
    });

    onMount(() => {
        props.onMount?.(controller);
    });

    const getCells = createMemo(() =>
        Array.from({ length: getColumns() * getRows() }, (_unused, index) => ({
            x: index % getColumns(),
            y: Math.floor(index / getColumns()),
        })),
    );

    const renderGrid = () => (
        <InteractionWrapper
            {...props}
            extraFlags={() => ({
                isCarrying: CarrierStack.getCarry() !== undefined,
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
                        props.ref?.(element);
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
                                {(getCell) => <div class={styles.sortableGridCell}>{props.renderCell?.(getCell)}</div>}
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
                                        left: `${getOffset(getItem().spot.x)}px`,
                                        top: `${getOffset(getItem().spot.y)}px`,
                                        width: `${getSpan(getItemGeometry().size.width)}px`,
                                        height: `${getSpan(getItemGeometry().size.height)}px`,
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
                                                label={() => getItemLabel(getItem())}
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
                                    left: `${getOffset(getPlace().x)}px`,
                                    top: `${getOffset(getPlace().y)}px`,
                                    width: `${getSpan(getLandingGeometry()?.size.width ?? 1)}px`,
                                    height: `${getSpan(getLandingGeometry()?.size.height ?? 1)}px`,
                                }}
                                aria-hidden="true"
                            >
                                <Show when={getLandingGeometry()}>
                                    {props.renderLanding?.(CarrierStack.getIsTargetAllowed, () =>
                                        getLandingGeometry()!,
                                    )}
                                </Show>
                            </div>
                        )}
                    </Show>
                </div>
            )}
        />
    );

    const getCarriedZIndex = () => {
        const root = getRootRef();

        return Math.max(AnchorUtils.getStackingBase(root), Elevation.getBase(root)) + 1;
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
                                "width": `${getSpan(getCarriedGeometry()?.size.width ?? 1)}px`,
                                "height": `${getSpan(getCarriedGeometry()?.size.height ?? 1)}px`,
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
