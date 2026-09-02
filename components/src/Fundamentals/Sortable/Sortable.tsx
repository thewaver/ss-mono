import { Index, Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import { Point2d, Size2d } from "@thewaver/ss-utils";

import { AnchorUtils } from "../../Abstracts/Anchor/Anchor.utils";
import type { CarrierZone, Carry, CarryMode, CarryPlace } from "../../Abstracts/Carrier/Carrier.types";
import { CarrierUtils } from "../../Abstracts/Carrier/Carrier.utils";
import { CarrierStack } from "../../Abstracts/Carrier/CarrierStack";
import { Elevation } from "../../Abstracts/Elevation/Elevation";
import { InteractionTracker } from "../../Abstracts/InteractionTracker/InteractionTracker";
import { useViewportContext } from "../../Exotics/Viewport/Viewport.context";
import { ViewportUtils } from "../../Exotics/Viewport/Viewport.utils";
import { access, accessSignal } from "../../Utils/propUtils";
import { LabelUtils } from "../Input/Label/Label.utils";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type { SortableDir, SortableItem, SortableItemSlotProps, SortableProps } from "./Sortable.types";

import * as styles from "./Sortable.css";

const DEFAULT_SORTABLE_DIR: SortableDir = "column";
const DEFAULT_SORTABLE_GAP = 0;

const INTERACTIVE_SELECTOR =
    "a[href], button, input, select, textarea, [role='button'], [role='checkbox'], [role='link'], [role='switch']";

const SortableItemSlot = (props: SortableItemSlotProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <div
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            class={styles.sortableItem}
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
            {props.renderContent(() => access(props.flags))}
        </div>
    );
};

export const Sortable = <T,>(props: SortableProps<T>) => {
    const itemsSignal = accessSignal(() => props.itemsSignal);

    const listId = createUniqueId();

    const viewportContext = useViewportContext();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getItemRefs, setItemRefs] = createSignal<Array<HTMLElement | undefined>>([]);
    const [getFocusedIndex, setFocusedIndex] = createSignal(0);
    const [getCarriedPoint, setCarriedPoint] = createSignal<Point2d | undefined>();
    const [getCarriedSize, setCarriedSize] = createSignal<Size2d | undefined>();

    let grabOffset: Point2d = { x: 0, y: 0 };

    const getAriaLabel = LabelUtils.resolveAriaLabel(() => access(props.ariaLabel));

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsLocked = createMemo(() => access(props.isLocked) ?? false);

    const getDir = createMemo(() => access(props.dir) ?? DEFAULT_SORTABLE_DIR);

    const getItems = createMemo(() => itemsSignal[0]());

    const getGroupId = createMemo(() => access(props.groupId));

    const setItemRef = (index: number, element: HTMLElement | undefined) => {
        setItemRefs((refs) => {
            const next = [...refs];

            next[index] = element;

            return next;
        });
    };

    const computeCarry = (item: SortableItem<T>): Carry => ({
        groupId: getGroupId(),
        key: props.computeItemKey(item.value),
        label: props.computeItemLabel(item.value),
        value: item,
    });

    const asIndex = (place: CarryPlace) => place as number;

    const getItemRects = () =>
        getItemRefs()
            .slice(0, getItems().length)
            .filter((element): element is HTMLElement => element !== undefined)
            .map((element) => element.getBoundingClientRect());

    const getSourceIndex = () => {
        const place = CarrierStack.getSourcePlace();

        return CarrierStack.getSourceZone() === zone && place !== undefined ? asIndex(place) : undefined;
    };

    const getPlaceCount = () =>
        getItems().length + (CarrierStack.getCarry() !== undefined && CarrierStack.getSourceZone() !== zone ? 1 : 0);

    const zone: CarrierZone = {
        getGroupId,
        getLabel: () => access(props.ariaLabel),
        getRootRef,
        getIsDisabled,
        getKeyHint: (hasOtherZones) =>
            hasOtherZones
                ? "Arrow keys choose a place, Tab changes list, Enter drops, Escape cancels."
                : "Arrow keys choose a place, Enter drops, Escape cancels.",
        computeCanAccept: (carry) => {
            if (getIsDisabled() || getIsLocked()) return false;

            const item = carry.value as SortableItem<T>;

            return props.computeCanAccept?.(item.value, CarrierStack.getSourceZone()?.getLabel() ?? "") ?? true;
        },
        computePlaceAtPoint: (point) => {
            const sourceIndex = getSourceIndex();

            return CarrierUtils.computeSettledIndex(
                CarrierUtils.computeDropIndex(getItemRects(), point.x, point.y, getDir()),
                sourceIndex ?? 0,
                sourceIndex !== undefined,
            );
        },
        computeNudgedPlace: (place, nudge) => {
            const step = (nudge.x ?? 0) + (nudge.y ?? 0);

            if (step === 0) return;

            return Math.min(Math.max(asIndex(place) + step, 0), getPlaceCount() - 1);
        },
        computeEntryPlace: () => getSourceIndex() ?? getItems().length,
        computeIsSamePlace: (a, b) => a === b,
        computeIsPlaceAllowed: () => true,
        computePlaceLabel: (place) => `place ${asIndex(place) + 1} of ${getPlaceCount()}`,
        takeAt: (place) => {
            const index = asIndex(place);

            itemsSignal[1]((items) => items.filter((_unused, itemIndex) => itemIndex !== index));
        },
        putAt: (place, carry, origin) => {
            const item = carry.value as SortableItem<T>;
            const index = asIndex(place);

            itemsSignal[1]((items) => [...items.slice(0, index), item, ...items.slice(index)]);

            props.onTransfer?.({
                value: item.value,
                fromLabel: origin.label,
                toLabel: access(props.ariaLabel),
                fromIndex: typeof origin.place === "number" ? origin.place : undefined,
                toIndex: index,
            });
        },
        moveAt: (fromPlace, toPlace) => {
            const fromIndex = asIndex(fromPlace);
            const toIndex = asIndex(toPlace);

            let moved: SortableItem<T> | undefined;

            itemsSignal[1]((items) => {
                const rest = items.filter((_unused, index) => index !== fromIndex);

                moved = items[fromIndex];

                return [...rest.slice(0, toIndex), items[fromIndex], ...rest.slice(toIndex)];
            });

            if (!moved) return;

            props.onTransfer?.({
                value: moved.value,
                fromLabel: access(props.ariaLabel),
                toLabel: access(props.ariaLabel),
                fromIndex,
                toIndex,
            });
        },
    };

    CarrierStack.registerZone(zone);

    const getIsSource = createMemo(() => CarrierStack.getSourceZone() === zone);

    const getIsReceiving = createMemo(() => CarrierStack.getTargetZone() === zone);

    const getCarriedKey = createMemo(() => (getIsSource() ? CarrierStack.getCarry()?.key : undefined));

    const getLandingIndex = createMemo(() => {
        const place = CarrierStack.getTargetPlace();

        if (!getIsReceiving() || place === undefined) return;

        return CarrierUtils.computeMarkerIndex(asIndex(place), getSourceIndex() ?? 0, getIsSource());
    });

    const getEndRoom = createMemo(() => (access(props.gap) ?? DEFAULT_SORTABLE_GAP) / 2);

    const getMarkerOffset = createMemo(() => {
        const markerIndex = getLandingIndex();
        const root = getRootRef();

        if (markerIndex === undefined || !root) return;

        const rects = getItemRects();
        const rootRect = root.getBoundingClientRect();
        const isRow = getDir() === "row";
        const scrolled = isRow ? root.scrollLeft : root.scrollTop;
        const span = isRow ? root.scrollWidth : root.scrollHeight;

        if (rects.length < 1) return span / 2;

        const scale = viewportContext.getScale();

        const startOf = (rect: DOMRect) =>
            (isRow ? rect.left - rootRect.left : rect.top - rootRect.top) / scale + scrolled;
        const endOf = (rect: DOMRect) =>
            (isRow ? rect.right - rootRect.left : rect.bottom - rootRect.top) / scale + scrolled;

        const before = markerIndex > 0 ? endOf(rects[markerIndex - 1]) : 0;
        const after = markerIndex < rects.length ? startOf(rects[markerIndex]) : span;

        return (before + after) / 2;
    });

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

    const getRovingIndex = createMemo(() => {
        const navigable = getNavigableIndexes();

        return navigable.includes(getFocusedIndex()) ? getFocusedIndex() : navigable[0];
    });

    const getItemId = (index: number) => `${listId}-item-${index}`;

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

        if (rect) {
            const origin = ViewportUtils.getAdjustedClientPoint({ x: rect.left, y: rect.top }, viewportContext);
            const grabbed = from && ViewportUtils.getAdjustedClientPoint(from, viewportContext);
            const scale = viewportContext.getScale();

            setCarriedSize({ width: rect.width / scale, height: rect.height / scale });

            grabOffset = grabbed
                ? { x: grabbed.x - origin.x, y: grabbed.y - origin.y }
                : { x: rect.width / scale / 2, y: rect.height / scale / 2 };

            setCarriedPoint(from ? ViewportUtils.getAdjustedClientPoint(from, viewportContext) : undefined);
        }

        CarrierStack.start(zone, index, computeCarry(item), mode);
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

        if (CarrierStack.getCarryMode() === "key") {
            const rect = getItemRefs()[index]?.getBoundingClientRect();

            if (rect) CarrierStack.aimAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }

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

        const isForward = e.key === (getDir() === "row" ? "ArrowRight" : "ArrowDown");
        const isBackward = e.key === (getDir() === "row" ? "ArrowLeft" : "ArrowUp");

        if (isCarrying) {
            if (!isForward && !isBackward) return;

            e.preventDefault();
            CarrierStack.aimAtNudge(getDir() === "row" ? { x: isForward ? 1 : -1 } : { y: isForward ? 1 : -1 });

            return;
        }

        const navigable = getNavigableIndexes();

        if (navigable.length < 1) return;

        const from = navigable.indexOf(index);

        let next: number | undefined;

        if (isForward) next = navigable[(from + 1) % navigable.length];
        if (isBackward) next = navigable[(from - 1 + navigable.length) % navigable.length];
        if (e.key === "Home") next = navigable[0];
        if (e.key === "End") next = navigable[navigable.length - 1];

        if (next === undefined) return;

        e.preventDefault();
        focusIndex(next);
    };

    const handleRootClick = (e: MouseEvent) => {
        if (getIsDisabled() || !CarrierStack.getCarry()) return;
        if (CarrierStack.getCarryMode() === "drag") return;
        if (e.target !== getRootRef()) return;
        if (!zone.computeCanAccept(CarrierStack.getCarry()!) && !getIsSource()) return;

        if (CarrierStack.getCarryMode() === "key") CarrierStack.aimAtPoint(e.clientX, e.clientY);

        CarrierStack.end("drop");
    };

    createEffect(() => {
        if (!getIsSource()) {
            setCarriedPoint(undefined);
            setCarriedSize(undefined);

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

    const renderList = () => (
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
                    id={listId}
                    ref={(element) => {
                        setRootRef(element);
                        setElementRef(element);
                        props.ref?.(element);
                    }}
                    class={getDir() === "row" ? styles.sortableRow : styles.sortableColumn}
                    style={{
                        gap: `${access(props.gap) ?? DEFAULT_SORTABLE_GAP}px`,
                        padding: `${getEndRoom()}px`,
                    }}
                    role="list"
                    aria-label={getAriaLabel()}
                    aria-disabled={getIsDisabled() || undefined}
                    onClick={handleRootClick}
                >
                    <Index each={getItems()}>
                        {(getItem, index) => (
                            <InteractionWrapper
                                sizing={() => (getDir() === "row" ? "fit-content" : "fill")}
                                isDisabled={() => getItem().isDisabled ?? false}
                                isReachableWhenDisabled={() => getItem().isReachableWhenDisabled ?? false}
                                isTabbable={() => getRovingIndex() === index}
                                tooltipDefs={() => getItem().tooltipDefs}
                                extraFlags={() => ({
                                    isCarried: getCarriedKey() === props.computeItemKey(getItem().value),
                                    isLandingBefore: getLandingIndex() === index,
                                })}
                                renderControl={(setItemElementRef, getItemFlags) => (
                                    <SortableItemSlot
                                        ref={(element) => {
                                            setItemRef(index, element);
                                            setItemElementRef(element);
                                        }}
                                        id={() => getItemId(index)}
                                        label={() => props.computeItemLabel(getItem().value)}
                                        position={() => index + 1}
                                        setSize={() => getItems().length}
                                        flags={getItemFlags}
                                        renderContent={(getContentFlags) => props.renderItem(getItem, getContentFlags)}
                                        onPointerDown={handlePointerDown(index)}
                                        onKeyDown={handleKeyDown(index)}
                                        onClick={handleClick(index)}
                                        onFocus={() => setFocusedIndex(index)}
                                    />
                                )}
                            />
                        )}
                    </Index>

                    <Show when={props.renderMarker && getMarkerOffset()} keyed>
                        {(offset: number) => (
                            <div
                                class={getDir() === "row" ? styles.sortableMarkerRow : styles.sortableMarkerColumn}
                                style={
                                    getDir() === "row"
                                        ? {
                                              left: `${offset}px`,
                                              top: `${getEndRoom()}px`,
                                              bottom: `${getEndRoom()}px`,
                                          }
                                        : {
                                              top: `${offset}px`,
                                              left: `${getEndRoom()}px`,
                                              right: `${getEndRoom()}px`,
                                          }
                                }
                                aria-hidden="true"
                            >
                                {props.renderMarker?.(getDir)}
                            </div>
                        )}
                    </Show>
                </div>
            )}
        />
    );

    const getCarriedItem = () => CarrierStack.getCarry()?.value as SortableItem<T> | undefined;

    const getCarriedZIndex = () => {
        const root = getRootRef();

        return Math.max(AnchorUtils.getStackingBase(root), Elevation.getBase(root)) + 1;
    };

    return (
        <>
            {renderList()}

            <Show when={props.renderCarried && getIsSource() && getCarriedPoint()}>
                {(getPoint: () => Point2d) => (
                    <Portal mount={viewportContext.getPortalRef()}>
                        <div
                            class={styles.sortableCarried}
                            style={{
                                "transform": `translate(${getPoint().x - grabOffset.x}px, ${getPoint().y - grabOffset.y}px)`,
                                "width": `${getCarriedSize()?.width ?? 0}px`,
                                "height": `${getCarriedSize()?.height ?? 0}px`,
                                "z-index": getCarriedZIndex(),
                            }}
                            aria-hidden="true"
                        >
                            <Show when={getCarriedItem()}>
                                {(getItem: () => SortableItem<T>) => props.renderCarried?.(getItem)}
                            </Show>
                        </div>
                    </Portal>
                )}
            </Show>
        </>
    );
};
