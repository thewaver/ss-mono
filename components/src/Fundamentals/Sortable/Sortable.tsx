import { Index, Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import { Point2d, Size2d } from "@thewaver/ss-utils";

import { AnchorUtils } from "../../Abstracts/Anchor/Anchor.utils";
import { Elevation } from "../../Abstracts/Elevation/Elevation";
import { InteractionTracker } from "../../Abstracts/InteractionTracker/InteractionTracker";
import { useViewportContext } from "../../Exotics/Viewport/Viewport.context";
import { ViewportUtils } from "../../Exotics/Viewport/Viewport.utils";
import { access } from "../../Utils/propUtils";
import { LabelUtils } from "../Input/Label/Label.utils";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type {
    SortableCarry,
    SortableCarryMode,
    SortableDir,
    SortableItem,
    SortableItemSlotProps,
    SortableProps,
    SortableZone,
} from "./Sortable.types";
import { SortableUtils } from "./Sortable.utils";
import { SortableStack } from "./SortableStack";

import * as styles from "./Sortable.css";

const DEFAULT_SORTABLE_DIR: SortableDir = "column";
const DEFAULT_SORTABLE_GAP = 0;
const CARRY_SLOP_PX = 4;

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

    const getItems = createMemo(() => props.itemsSignal[0]());

    const getGroupId = createMemo(() => access(props.groupId));

    const setItemRef = (index: number, element: HTMLElement | undefined) => {
        setItemRefs((refs) => {
            const next = [...refs];

            next[index] = element;

            return next;
        });
    };

    const computeCarry = (item: SortableItem<T>): SortableCarry => ({
        groupId: getGroupId(),
        key: props.computeItemKey(item.value),
        label: props.computeItemLabel(item.value),
        value: item,
    });

    const zone: SortableZone = {
        getGroupId,
        getLabel: () => access(props.ariaLabel),
        getRootRef,
        getDir,
        getIsDisabled,
        getLength: () => getItems().length,
        getItemRects: () =>
            getItemRefs()
                .slice(0, getItems().length)
                .filter((element): element is HTMLElement => element !== undefined)
                .map((element) => element.getBoundingClientRect()),
        computeCanAccept: (carry) => {
            if (getIsDisabled() || getIsLocked()) return false;

            const item = carry.value as SortableItem<T>;

            return props.computeCanAccept?.(item.value, carry.groupId) ?? true;
        },
        takeAt: (index) => {
            props.itemsSignal[1]((items) => items.filter((_unused, itemIndex) => itemIndex !== index));
        },
        putAt: (index, carry, origin) => {
            const item = carry.value as SortableItem<T>;

            props.itemsSignal[1]((items) => [...items.slice(0, index), item, ...items.slice(index)]);

            props.onTransfer?.({
                value: item.value,
                fromLabel: origin.label,
                toLabel: access(props.ariaLabel),
                fromIndex: origin.index,
                toIndex: index,
            });
        },
        moveAt: (fromIndex, toIndex) => {
            let moved: SortableItem<T> | undefined;

            props.itemsSignal[1]((items) => {
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

    SortableStack.registerZone(zone);

    const getIsSource = createMemo(() => SortableStack.getSourceZone() === zone);

    const getIsReceiving = createMemo(() => SortableStack.getTargetZone() === zone);

    const getCarriedKey = createMemo(() => (getIsSource() ? SortableStack.getCarry()?.key : undefined));

    const getLandingIndex = createMemo(() => {
        const settledIndex = SortableStack.getTargetIndex();

        if (!getIsReceiving() || settledIndex === undefined) return;

        return SortableUtils.computeMarkerIndex(settledIndex, SortableStack.getSourceIndex() ?? 0, getIsSource());
    });

    const getEndRoom = createMemo(() => (access(props.gap) ?? DEFAULT_SORTABLE_GAP) / 2);

    const getMarkerOffset = createMemo(() => {
        const markerIndex = getLandingIndex();
        const root = getRootRef();

        if (markerIndex === undefined || !root) return;

        const rects = zone.getItemRects();
        const rootRect = root.getBoundingClientRect();
        const isRow = getDir() === "row";
        const scrolled = isRow ? root.scrollLeft : root.scrollTop;
        const span = isRow ? root.scrollWidth : root.scrollHeight;

        if (rects.length < 1) return span / 2;

        // The rects are on-screen and the offset is written as layout, so a scaled Viewport divides them apart.
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

    const pickUp = (index: number, mode: SortableCarryMode, from?: Point2d) => {
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

        SortableStack.start(zone, index, computeCarry(item), mode);
    };

    const handlePointerDown = (index: number) => (e: PointerEvent) => {
        if (e.button !== 0 || getIsDisabled()) return;
        if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;
        if (SortableStack.getCarry()) return;

        const element = getItemRefs()[index];

        if (!element) return;

        const startX = e.clientX;
        const startY = e.clientY;

        let hasStarted = false;

        const handleMove = (moveEvent: PointerEvent) => {
            if (moveEvent.pointerId !== e.pointerId) return;

            if (!hasStarted) {
                const distance = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);

                if (distance < CARRY_SLOP_PX) return;

                hasStarted = true;
                element.setPointerCapture(e.pointerId);
                pickUp(index, "drag", { x: startX, y: startY });
            }

            moveEvent.preventDefault();
            SortableStack.aimAtPoint(moveEvent.clientX, moveEvent.clientY);
        };

        const handleEnd = (endEvent: PointerEvent) => {
            if (endEvent.pointerId !== e.pointerId) return;

            element.removeEventListener("pointermove", handleMove);
            element.removeEventListener("pointerup", handleEnd);
            element.removeEventListener("pointercancel", handleEnd);

            if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId);

            if (!hasStarted) return;

            hasPendingClick = true;

            SortableStack.end(endEvent.type === "pointercancel" ? "cancel" : "drop");
        };

        element.addEventListener("pointermove", handleMove);
        element.addEventListener("pointerup", handleEnd);
        element.addEventListener("pointercancel", handleEnd);
    };

    const handleClick = (index: number) => (e: MouseEvent) => {
        if (getIsDisabled()) return;
        if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;

        const carry = SortableStack.getCarry();

        if (!carry) {
            pickUp(index, "tap", { x: e.clientX, y: e.clientY });
            focusIndex(index);

            return;
        }

        if (SortableStack.getCarryMode() === "drag") return;

        if (SortableStack.getCarryMode() === "key") {
            const rect = getItemRefs()[index]?.getBoundingClientRect();

            if (rect) SortableStack.aimAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }

        SortableStack.end("drop");
    };

    const handleKeyDown = (index: number) => (e: KeyboardEvent) => {
        if (getIsDisabled()) return;

        const isCarrying = SortableStack.getCarry() !== undefined && SortableStack.getCarryMode() !== "drag";

        if (e.key === "Escape") {
            if (!isCarrying) return;

            e.preventDefault();
            SortableStack.end("cancel");

            return;
        }

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();

            if (isCarrying) {
                SortableStack.end("drop");

                return;
            }

            pickUp(index, "key");

            return;
        }

        if (isCarrying && e.key === "Tab") {
            e.preventDefault();
            SortableStack.aimAtNextZone(e.shiftKey ? -1 : 1);

            return;
        }

        const isForward = e.key === (getDir() === "row" ? "ArrowRight" : "ArrowDown");
        const isBackward = e.key === (getDir() === "row" ? "ArrowLeft" : "ArrowUp");

        if (isCarrying) {
            if (!isForward && !isBackward) return;

            e.preventDefault();
            SortableStack.aimAtIndex(isForward ? 1 : -1);

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
        if (getIsDisabled() || !SortableStack.getCarry()) return;
        if (SortableStack.getCarryMode() === "drag") return;
        if (e.target !== getRootRef()) return;
        if (!zone.computeCanAccept(SortableStack.getCarry()!) && !getIsSource()) return;

        if (SortableStack.getCarryMode() === "key") SortableStack.aimAtPoint(e.clientX, e.clientY);

        SortableStack.end("drop");
    };

    createEffect(() => {
        if (!getIsSource()) {
            setCarriedPoint(undefined);
            setCarriedSize(undefined);

            return;
        }

        const trackPoint = (e: PointerEvent) => {
            setCarriedPoint(ViewportUtils.getAdjustedClientPoint({ x: e.clientX, y: e.clientY }, viewportContext));

            if (SortableStack.getCarryMode() !== "tap") return;

            SortableStack.aimAtPoint(e.clientX, e.clientY);
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
        if (!getIsDisabled() || !SortableStack.getCarry()) return;
        if (SortableStack.getSourceZone() !== zone) return;

        SortableStack.end("cancel");
    });

    onCleanup(() => {
        if (SortableStack.getSourceZone() === zone) SortableStack.end("cancel");
    });

    const renderList = () => (
        <InteractionWrapper
            {...props}
            extraFlags={() => ({
                isCarrying: SortableStack.getCarry() !== undefined,
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

    const getCarriedItem = () => SortableStack.getCarry()?.value as SortableItem<T> | undefined;

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
