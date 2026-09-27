import {
    type Accessor,
    Index,
    type JSX,
    Show,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    onCleanup,
} from "solid-js";
import { Portal } from "solid-js/web";

import {
    AnchorUtils,
    CarrierUtils,
    type CarrierZone,
    type CarryMode,
    type InteractionSizing,
    type PlacementRect,
    PlacementUtils,
    SORTABLE_DEFAULTS,
    SortableUtils,
    ViewportUtils,
    SortableStyles as styles,
} from "@thewaver/ss-components";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

import { CarrierSolidUtils } from "../../Abstracts/Carrier/CarrierSolid.utils";
import { ElevationSolidUtils } from "../../Abstracts/Elevation/ElevationSolid.utils";
import { NavigatorSolidUtils } from "../../Abstracts/Navigator/NavigatorSolid.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access, accessSignal } from "../../Utils/propUtils";
import { LabelSolidUtils } from "../Input/Label/LabelSolid.utils";
import type { SortableItem, SortableItemSlotProps, SortableProps } from "./SortableSolid.types";

const PLACED_SIZING: InteractionSizing = "fill";

const SortableItemSlot = (props: SortableItemSlotProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <div
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            class={styles.sortableItem}
            role="listitem"
            aria-roledescription={access(props.roleDescription)}
            aria-label={access(props.label)}
            aria-describedby={access(props.hintId)}
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
    const hintId = createUniqueId();

    const viewportContext = useViewportContext();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();
    const [getItemRefs, setItemRefs] = createSignal<Array<HTMLElement | undefined>>([]);
    const [getFocusedIndex, setFocusedIndex] = createSignal(0);
    const [getCarriedPoint, setCarriedPoint] = createSignal<Point2d | undefined>();
    const [getCarriedSize, setCarriedSize] = createSignal<Size2d | undefined>();

    let grabOffset: Point2d = { x: 0, y: 0 };

    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(() => access(props.ariaLabel));

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsLocked = createMemo(() => access(props.isLocked) ?? false);

    const getOrientation = createMemo(() => access(props.orientation) ?? SORTABLE_DEFAULTS.orientation);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getItems = createMemo(() => itemsSignal[0]());

    const getGroupId = createMemo(() => access(props.groupId));

    const setItemRef = (index: number, element: HTMLElement | undefined) => {
        setItemRefs((refs) => {
            const next = [...refs];

            next[index] = element;

            return next;
        });
    };

    const getItemRects = () =>
        getItemRefs()
            .slice(0, getItems().length)
            .filter((element): element is HTMLElement => element !== undefined)
            .map((element) => element.getBoundingClientRect());

    const getSourceIndex = (): number | undefined =>
        SortableUtils.computeSourceIndex(CarrierSolidUtils.getSourceZone(), CarrierSolidUtils.getSourcePlace(), zone);

    const getPlaceCount = (): number =>
        SortableUtils.computePlaceCount(
            getItems().length,
            CarrierSolidUtils.getCarry(),
            CarrierSolidUtils.getSourceZone(),
            zone,
        );

    const zone: CarrierZone = SortableUtils.createZone({
        getItems,
        updateItems: (update) => itemsSignal[1](update),
        getGroupId,
        getLabel: () => access(props.ariaLabel),
        getRootRef,
        getBoxRef,
        getIsDisabled,
        getIsLocked,
        getAnnouncements: () => access(props.announcements),
        getOrientation,
        getDirection,
        getLayout: () => getLayout(),
        getItemRects,
        getSourceIndex,
        getPlaceCount,
        computeCanAccept: (value, fromLabel) => props.computeCanAccept?.(value, fromLabel) ?? true,
        onTransfer: (transfer) => props.onTransfer?.(transfer),
    });

    CarrierSolidUtils.registerZone(zone);

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: getPlaceCount() }));

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const getIsSource = createMemo(() => CarrierSolidUtils.getSourceZone() === zone);

    const getIsReceiving = createMemo(() => CarrierSolidUtils.getTargetZone() === zone);

    const getCarriedKey = createMemo(() => (getIsSource() ? CarrierSolidUtils.getCarry()?.key : undefined));

    const getLandingIndex = createMemo(() =>
        SortableUtils.computeLandingIndex(
            CarrierSolidUtils.getTargetZone(),
            CarrierSolidUtils.getTargetPlace(),
            getSourceIndex(),
            zone,
        ),
    );

    const getEndRoom = createMemo(() => (access(props.gap) ?? SORTABLE_DEFAULTS.gap) * 0.5);

    const getMarkerPlacement = createMemo(() => {
        const layout = getLayout();
        const markerIndex = getLandingIndex();

        if (layout === undefined || markerIndex === undefined) return undefined;

        return PlacementUtils.getGapPlacement(layout.placements, markerIndex);
    });

    const getMarkerOffset = createMemo(() => {
        const markerIndex = getLandingIndex();
        const root = getRootRef();

        if (markerIndex === undefined || !root) return;

        return SortableUtils.computeMarkerOffset(root, getItemRects(), markerIndex, {
            orientation: getOrientation(),
            direction: getDirection(),
            scale: viewportContext.getScale(),
        });
    });

    const getNavigableIndexes = createMemo(() => SortableUtils.computeNavigableIndexes(getItems()));

    const getRovingIndex = createMemo(() => SortableUtils.computeRovingIndex(getNavigableIndexes(), getFocusedIndex()));

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
            const pickUpGeometry = SortableUtils.computePickUp(rect, viewportContext, from);

            setCarriedSize(pickUpGeometry.size);

            grabOffset = pickUpGeometry.grabOffset;

            setCarriedPoint(pickUpGeometry.point);
        }

        CarrierUtils.start(
            zone,
            index,
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

        const element = getItemRefs()[index];

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

        if (action === "aimAndDrop") {
            const rect = getItemRefs()[index]?.getBoundingClientRect();

            if (rect) CarrierUtils.aimAtPoint(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);
        }

        CarrierSolidUtils.end("drop");
    };

    const handleKeyDown = (index: number) => (e: KeyboardEvent) => {
        if (getIsDisabled()) return;

        const action = SortableUtils.computeKeyAction(e.key, {
            index,
            isShifted: e.shiftKey,
            isCarrying: CarrierSolidUtils.getCarry() !== undefined && CarrierSolidUtils.getCarryMode() !== "drag",
            isPlaced: getLayout() !== undefined,
            orientation: getOrientation(),
            direction: getDirection(),
            navigable: getNavigableIndexes(),
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
        if (getIsDisabled() || !CarrierSolidUtils.getCarry()) return;

        const action = SortableUtils.computeClickAction(CarrierSolidUtils.getCarryMode());

        if (action === undefined) return;
        if (e.target !== getRootRef()) return;
        if (!zone.computeCanAccept(CarrierSolidUtils.getCarry()!) && !getIsSource()) return;

        if (action === "aimAndDrop") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

        CarrierSolidUtils.end("drop");
    };

    createEffect(() => {
        if (!getIsSource()) {
            setCarriedPoint(undefined);
            setCarriedSize(undefined);

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

    const renderItemAt = (getItem: Accessor<SortableItem<T>>, index: number) => (
        <InteractionWrapper
            sizing={() =>
                getPlacementAt(index) !== undefined
                    ? PLACED_SIZING
                    : getOrientation() === "horizontal"
                      ? "fit-content"
                      : "fill"
            }
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
                    hintId={() => hintId}
                    label={() => props.computeItemLabel(getItem().value)}
                    roleDescription={() => access(props.itemRoleDescription) ?? SORTABLE_DEFAULTS.itemRoleDescription}
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
    );

    const renderPlacedItem = (index: number, element: JSX.Element) => (
        <Show when={getPlacementAt(index)} fallback={element}>
            {(getRect) => <PlacementItem placement={getRect}>{element}</PlacementItem>}
        </Show>
    );

    const renderPlaced = (children: JSX.Element) => (
        <Show when={getLayout()} fallback={children}>
            {(getResolved) => (
                <PlacementBox ref={setBoxRef} layout={getResolved} computeEffect={props.computeEffect}>
                    {children}
                </PlacementBox>
            )}
        </Show>
    );

    const renderList = () => (
        <InteractionWrapper
            {...props}
            sizing={() => (getLayout() !== undefined ? "fill" : (access(props.sizing) ?? "fit-content"))}
            extraFlags={() => ({
                isCarrying: CarrierSolidUtils.getCarry() !== undefined,
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
                    class={getOrientation() === "horizontal" ? styles.sortableRow : styles.sortableColumn}
                    style={{
                        gap: `${access(props.gap) ?? SORTABLE_DEFAULTS.gap}px`,
                        padding: `${getEndRoom()}px`,
                    }}
                    role="list"
                    aria-label={getAriaLabel()}
                    aria-disabled={getIsDisabled() || undefined}
                    onClick={handleRootClick}
                >
                    {renderPlaced(
                        <>
                            <Index each={getItems()}>
                                {(getItem, index) => renderPlacedItem(index, renderItemAt(getItem, index))}
                            </Index>

                            <Show when={props.renderMarker && getMarkerPlacement()} keyed>
                                {(placement: PlacementRect) => (
                                    <PlacementItem placement={() => placement}>
                                        <div class={styles.sortableMarkerPlaced} aria-hidden="true">
                                            {props.renderMarker?.(getOrientation)}
                                        </div>
                                    </PlacementItem>
                                )}
                            </Show>
                        </>,
                    )}

                    <Show when={props.renderMarker && getLayout() === undefined && getMarkerOffset()} keyed>
                        {(offset: number) => (
                            <div
                                class={
                                    getOrientation() === "horizontal"
                                        ? styles.sortableMarkerRow
                                        : styles.sortableMarkerColumn
                                }
                                style={
                                    getOrientation() === "horizontal"
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
                                {props.renderMarker?.(getOrientation)}
                            </div>
                        )}
                    </Show>
                </div>
            )}
        />
    );

    const renderRestingHint = () => (
        <div id={hintId} class={styles.sortableHint}>
            {access(props.announcements).restingKeyHint}
        </div>
    );

    const getCarriedItem = () => CarrierSolidUtils.getCarry()?.value as SortableItem<T> | undefined;

    const getCarriedZIndex = () => {
        const root = getRootRef();

        return Math.max(AnchorUtils.getStackingBase(root), ElevationSolidUtils.getBase(root)) + 1;
    };

    return (
        <>
            {renderRestingHint()}

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
