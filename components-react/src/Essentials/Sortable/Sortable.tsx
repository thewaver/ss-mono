import {
    Fragment,
    type KeyboardEvent,
    type MouseEvent,
    type PointerEvent,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

import {
    AnchorUtils,
    CarrierUtils,
    type CarrierZone,
    type CarryMode,
    type InteractionSizing,
    PlacementUtils,
    SORTABLE_DEFAULTS,
    type SortableFlags,
    type SortableItemFlags,
    SortableStyles,
    SortableUtils,
    ViewportUtils,
} from "@thewaver/ss-components";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

import { CarrierReactUtils } from "../../Abstracts/Carrier/CarrierReact.utils";
import { ElevationReactUtils } from "../../Abstracts/Elevation/ElevationReact.utils";
import { NavigatorReactUtils } from "../../Abstracts/Navigator/NavigatorReact.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { useElement } from "../../Utils/refUtils";
import { LabelReactUtils } from "../Input/Label/LabelReact.utils";
import type { SortableItem, SortableItemSlotProps, SortableProps } from "./Sortable.types";

const PLACED_SIZING: InteractionSizing = "fill";

const SortableItemSlot = (props: SortableItemSlotProps) => {
    const isDisabled = props.flags.isDisabled ?? false;

    return (
        <div
            id={props.id}
            ref={props.ref}
            className={SortableStyles.sortableItem}
            role="listitem"
            aria-roledescription={props.roleDescription}
            aria-label={props.label}
            aria-describedby={props.hintId}
            aria-posinset={props.position}
            aria-setsize={props.setSize}
            aria-disabled={isDisabled || undefined}
            onPointerDown={props.onPointerDown}
            onKeyDown={props.onKeyDown}
            onClick={props.onClick}
            onFocus={props.onFocus}
        >
            {props.renderContent(props.flags)}
        </div>
    );
};

export const Sortable = <T,>(props: SortableProps<T>) => {
    const [items, setItems] = props.itemsState;

    const listId = useId();
    const hintId = useId();

    const viewportContext = useViewportContext();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const boxRef = useRef<HTMLElement | null>(null);
    const itemRefs = useRef<Array<HTMLElement | undefined>>([]);
    const grabOffsetRef = useRef<Point2d>({ x: 0, y: 0 });
    const hasPendingClickRef = useRef(false);

    const rootElement = useElement(rootRef);

    const [focusedIndex, setFocusedIndex] = useState(0);
    const [carriedPoint, setCarriedPoint] = useState<Point2d>();
    const [carriedSize, setCarriedSize] = useState<Size2d>();
    const [markerOffset, setMarkerOffset] = useState<number>();

    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);

    const isDisabled = props.isDisabled ?? false;
    const isLocked = props.isLocked ?? false;
    const orientation = props.orientation ?? SORTABLE_DEFAULTS.orientation;
    const gap = props.gap ?? SORTABLE_DEFAULTS.gap;
    const endRoom = gap * 0.5;

    const direction = NavigatorReactUtils.useDirection(rootRef);
    const carryState = CarrierReactUtils.useCarry();

    const getItemRects = () =>
        itemRefs.current
            .slice(0, items.length)
            .filter((element): element is HTMLElement => element !== undefined)
            .map((element) => element.getBoundingClientRect());

    const zone: CarrierZone = CarrierReactUtils.useZone(
        SortableUtils.createZone({
            getItems: () => items,
            updateItems: (update) => setItems(update(items)),
            getGroupId: () => props.groupId,
            getLabel: () => props.ariaLabel,
            getRootRef: () => rootRef.current ?? undefined,
            getBoxRef: () => boxRef.current ?? undefined,
            getIsDisabled: () => isDisabled,
            getIsLocked: () => isLocked,
            getAnnouncements: () => props.announcements,
            getOrientation: () => orientation,
            getDirection: () => direction,
            getLayout: () => layout,
            getItemRects,
            getSourceIndex: () =>
                SortableUtils.computeSourceIndex(CarrierUtils.getSourceZone(), CarrierUtils.getSourcePlace(), zone),
            getPlaceCount: () =>
                SortableUtils.computePlaceCount(
                    items.length,
                    CarrierUtils.getCarry(),
                    CarrierUtils.getSourceZone(),
                    zone,
                ),
            computeCanAccept: (value, fromLabel) => props.computeCanAccept?.(value, fromLabel) ?? true,
            onTransfer: (transfer) => props.onTransfer?.(transfer),
        }),
    );

    const sourceIndex = SortableUtils.computeSourceIndex(carryState?.from, carryState?.fromPlace, zone);
    const placeCount = SortableUtils.computePlaceCount(items.length, carryState?.carry, carryState?.from, zone);

    const computeLayout = props.computeLayout;
    const layout = useMemo(() => computeLayout?.({ itemCount: placeCount }), [computeLayout, placeCount]);
    const isPlaced = layout !== undefined;

    const isSource = carryState?.from === zone;
    const isReceiving = carryState?.to === zone;
    const carriedKey = isSource ? carryState?.carry.key : undefined;
    const landingIndex = SortableUtils.computeLandingIndex(carryState?.to, carryState?.toPlace, sourceIndex, zone);

    const markerPlacement = useMemo(
        () =>
            layout === undefined || landingIndex === undefined
                ? undefined
                : PlacementUtils.getGapPlacement(layout.placements, landingIndex),
        [layout, landingIndex],
    );

    const scale = viewportContext.getScale();

    useLayoutEffect(() => {
        const root = rootRef.current;
        const next =
            landingIndex === undefined || !root
                ? undefined
                : SortableUtils.computeMarkerOffset(root, getItemRects(), landingIndex, {
                      orientation,
                      direction,
                      scale,
                  });

        setMarkerOffset((previous) => (previous === next ? previous : next));
    }, [landingIndex, orientation, direction, scale, items]);

    const navigable = SortableUtils.computeNavigableIndexes(items);
    const rovingIndex = SortableUtils.computeRovingIndex(navigable, focusedIndex);

    const getItemId = (index: number) => `${listId}-item-${index}`;

    const focusIndex = (index: number) => {
        setFocusedIndex(index);
        itemRefs.current[index]?.focus();
    };

    const pickUp = (index: number, mode: CarryMode, from?: Point2d) => {
        if (isDisabled) return;

        const item = items[index];

        if (!item || item.isDisabled) return;

        const rect = itemRefs.current[index]?.getBoundingClientRect();

        if (rect) {
            const pickUpGeometry = SortableUtils.computePickUp(rect, viewportContext, from);

            setCarriedSize(pickUpGeometry.size);
            grabOffsetRef.current = pickUpGeometry.grabOffset;
            setCarriedPoint(pickUpGeometry.point);
        }

        CarrierUtils.start(
            zone,
            index,
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

        if (action === "aimAndDrop") {
            const rect = itemRefs.current[index]?.getBoundingClientRect();

            if (rect) CarrierUtils.aimAtPoint(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);
        }

        CarrierUtils.end("drop");
    };

    const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLDivElement>) => {
        if (isDisabled) return;

        const action = SortableUtils.computeKeyAction(e.key, {
            index,
            isShifted: e.shiftKey,
            isCarrying: CarrierUtils.getCarry() !== undefined && CarrierUtils.getCarryMode() !== "drag",
            isPlaced,
            orientation,
            direction,
            navigable,
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

        const action = SortableUtils.computeClickAction(CarrierUtils.getCarryMode());

        if (action === undefined) return;
        if (e.target !== rootRef.current) return;
        if (!zone.computeCanAccept(carry) && !isSource) return;

        if (action === "aimAndDrop") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

        CarrierUtils.end("drop");
    };

    useEffect(() => {
        if (!isSource) {
            setCarriedPoint(undefined);
            setCarriedSize(undefined);

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
        if (!isDisabled || !carryState || carryState.from !== zone) return;

        CarrierUtils.end("cancel");
    }, [isDisabled, carryState, zone]);

    useEffect(
        () => () => {
            if (CarrierUtils.getSourceZone() === zone) CarrierUtils.end("cancel");
        },
        [zone],
    );

    const elevationBase = ElevationReactUtils.useBase(rootElement);

    const roleDescription = props.itemRoleDescription ?? SORTABLE_DEFAULTS.itemRoleDescription;

    const renderItemAt = (item: SortableItem<T>, index: number) => {
        const placement = layout?.placements[index];

        const element = (
            <InteractionWrapper<SortableItemFlags>
                sizing={placement !== undefined ? PLACED_SIZING : orientation === "horizontal" ? "fit-content" : "fill"}
                isDisabled={item.isDisabled ?? false}
                isReachableWhenDisabled={item.isReachableWhenDisabled ?? false}
                isTabbable={rovingIndex === index}
                tooltipDefs={item.tooltipDefs}
                extraFlags={{
                    isCarried: carriedKey === props.computeItemKey(item.value),
                    isLandingBefore: landingIndex === index,
                }}
                ref={(itemElement) => {
                    itemRefs.current[index] = itemElement ?? undefined;
                }}
                renderControl={(setElementRef, itemFlags) => (
                    <SortableItemSlot
                        ref={setElementRef}
                        id={getItemId(index)}
                        hintId={hintId}
                        label={props.computeItemLabel(item.value)}
                        roleDescription={roleDescription}
                        position={index + 1}
                        setSize={items.length}
                        flags={itemFlags}
                        renderContent={(contentFlags) => props.renderItem(item, contentFlags)}
                        onPointerDown={handlePointerDown(index)}
                        onKeyDown={handleKeyDown(index)}
                        onClick={handleClick(index)}
                        onFocus={() => setFocusedIndex(index)}
                    />
                )}
            />
        );

        return placement ? (
            <PlacementItem key={index} placement={placement}>
                {element}
            </PlacementItem>
        ) : (
            <Fragment key={index}>{element}</Fragment>
        );
    };

    const listContent = (
        <>
            {items.map(renderItemAt)}

            {props.renderMarker && markerPlacement && (
                <PlacementItem placement={markerPlacement}>
                    <div className={SortableStyles.sortableMarkerPlaced} aria-hidden="true">
                        {props.renderMarker(orientation)}
                    </div>
                </PlacementItem>
            )}
        </>
    );

    const isHorizontal = orientation === "horizontal";

    const list = (
        <InteractionWrapper<SortableFlags>
            {...props}
            sizing={layout !== undefined ? "fill" : (props.sizing ?? "fit-content")}
            extraFlags={{
                isCarrying: carryState !== undefined,
                isReceiving,
                isSource,
                isEmpty: items.length < 1,
            }}
            renderControl={(setElementRef) => (
                <div
                    id={listId}
                    ref={(element) => {
                        rootRef.current = element;
                        setElementRef(element);
                    }}
                    className={isHorizontal ? SortableStyles.sortableRow : SortableStyles.sortableColumn}
                    style={{ gap: `${gap}px`, padding: `${endRoom}px` }}
                    role="list"
                    aria-label={ariaLabel}
                    aria-disabled={isDisabled || undefined}
                    onClick={handleRootClick}
                >
                    {layout ? (
                        <PlacementBox
                            ref={(element) => {
                                boxRef.current = element;
                            }}
                            layout={layout}
                            computeEffect={props.computeEffect}
                        >
                            {listContent}
                        </PlacementBox>
                    ) : (
                        listContent
                    )}

                    {props.renderMarker && layout === undefined && markerOffset !== undefined && (
                        <div
                            className={
                                isHorizontal ? SortableStyles.sortableMarkerRow : SortableStyles.sortableMarkerColumn
                            }
                            style={
                                isHorizontal
                                    ? { left: `${markerOffset}px`, top: `${endRoom}px`, bottom: `${endRoom}px` }
                                    : { top: `${markerOffset}px`, left: `${endRoom}px`, right: `${endRoom}px` }
                            }
                            aria-hidden="true"
                        >
                            {props.renderMarker(orientation)}
                        </div>
                    )}
                </div>
            )}
        />
    );

    const carriedItem = carryState?.carry.value as SortableItem<T> | undefined;

    const carriedZIndex = Math.max(AnchorUtils.getStackingBase(rootElement), elevationBase) + 1;

    return (
        <>
            <div id={hintId} className={SortableStyles.sortableHint}>
                {props.announcements.restingKeyHint}
            </div>

            {list}

            {props.renderCarried &&
                isSource &&
                carriedPoint &&
                createPortal(
                    <div
                        className={SortableStyles.sortableCarried}
                        style={{
                            transform: `translate(${carriedPoint.x - grabOffsetRef.current.x}px, ${carriedPoint.y - grabOffsetRef.current.y}px)`,
                            width: `${carriedSize?.width ?? 0}px`,
                            height: `${carriedSize?.height ?? 0}px`,
                            zIndex: carriedZIndex,
                        }}
                        aria-hidden="true"
                    >
                        {carriedItem && props.renderCarried(carriedItem)}
                    </div>,
                    viewportContext.getPortalRef() ?? document.body,
                )}
        </>
    );
};
