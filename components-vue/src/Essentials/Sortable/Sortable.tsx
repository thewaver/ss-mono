import {
    type ComponentPublicInstance,
    Fragment,
    type SlotsType,
    Teleport,
    type VNodeChild,
    computed,
    defineComponent,
    onScopeDispose,
    shallowRef,
    useId,
} from "vue";

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

import { CarrierVueUtils } from "../../Abstracts/Carrier/CarrierVue.utils";
import { ElevationVueUtils } from "../../Abstracts/Elevation/ElevationVue.utils";
import { NavigatorVueUtils } from "../../Abstracts/Navigator/NavigatorVue.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionWrapperSlots } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { LabelVueUtils } from "../Input/Label/LabelVue.utils";
import type {
    SortableItem,
    SortableItemSlotProps,
    SortableItemSlotSlots,
    SortableProps,
    SortableSlots,
} from "./Sortable.types";

const PLACED_SIZING: InteractionSizing = "fill";

const SortableItemSlot = defineComponent(
    (props: SortableItemSlotProps, { slots }: SlotsContext<SortableItemSlotSlots>) => () => {
        const isDisabled = props.flags.isDisabled ?? false;

        return (
            <div
                id={props.id}
                class={SortableStyles.sortableItem}
                role="listitem"
                aria-roledescription={props.roleDescription}
                aria-label={props.label}
                aria-describedby={props.hintId}
                aria-posinset={props.position}
                aria-setsize={props.setSize}
                aria-disabled={isDisabled || undefined}
                onPointerdown={props.onPointerDown}
                onKeydown={props.onKeyDown}
                onClick={props.onClick}
                onFocusin={props.onFocus}
            >
                {callSlot(slots.renderContent, props.flags)}
            </div>
        );
    },
    {
        name: "SortableItemSlot",
        slots: Object as SlotsType<SortableItemSlotSlots>,
        props: declareProps<SortableItemSlotProps>({
            id: null,
            label: null,
            roleDescription: null,
            hintId: null,
            position: null,
            setSize: null,
            flags: null,
            onPointerDown: null,
            onKeyDown: null,
            onClick: null,
            onFocus: null,
        }),
    },
);

export const Sortable = defineComponent(
    <T,>(props: SortableProps<T>, { slots }: SlotsContext<SortableSlots<T>>) => {
        const items = useTwoWay(props, "items");

        const listId = useId();
        const hintId = useId();

        const viewportContext = useViewportContext();

        const rootRef = shallowRef<HTMLElement>();
        const itemRefs: Array<HTMLElement | undefined> = [];

        let boxElement: HTMLElement | undefined;
        let grabOffset: Point2d = { x: 0, y: 0 };
        let hasPendingClick = false;

        const focusedIndex = shallowRef(0);
        const carriedPoint = shallowRef<Point2d>();
        const carriedSize = shallowRef<Size2d>();
        const markerOffset = shallowRef<number>();

        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);

        const getIsDisabled = () => props.isDisabled ?? false;
        const getIsLocked = () => props.isLocked ?? false;
        const getOrientation = () => props.orientation ?? SORTABLE_DEFAULTS.orientation;

        const direction = NavigatorVueUtils.useDirection(rootRef);
        const carryState = CarrierVueUtils.useCarry();

        const getItemRects = () =>
            itemRefs
                .slice(0, items.value.length)
                .filter((element): element is HTMLElement => element !== undefined)
                .map((element) => element.getBoundingClientRect());

        const zone: CarrierZone = CarrierVueUtils.useZone(
            SortableUtils.createZone({
                getItems: () => items.value,
                updateItems: (update) => {
                    items.value = update(items.value);
                },
                getGroupId: () => props.groupId,
                getLabel: () => props.ariaLabel,
                getRootRef: () => rootRef.value,
                getBoxRef: () => boxElement,
                getIsDisabled,
                getIsLocked,
                getAnnouncements: () => props.announcements,
                getOrientation,
                getDirection: () => direction.value,
                getLayout: () => layout.value,
                getItemRects,
                getSourceIndex: () =>
                    SortableUtils.computeSourceIndex(CarrierUtils.getSourceZone(), CarrierUtils.getSourcePlace(), zone),
                getPlaceCount: () =>
                    SortableUtils.computePlaceCount(
                        items.value.length,
                        CarrierUtils.getCarry(),
                        CarrierUtils.getSourceZone(),
                        zone,
                    ),
                computeCanAccept: (value, fromLabel) => props.computeCanAccept?.(value, fromLabel) ?? true,
                onTransfer: (transfer) => props.onTransfer?.(transfer),
            }),
        );

        const sourceIndex = computed(() =>
            SortableUtils.computeSourceIndex(carryState.value?.from, carryState.value?.fromPlace, zone),
        );

        const placeCount = computed(() =>
            SortableUtils.computePlaceCount(items.value.length, carryState.value?.carry, carryState.value?.from, zone),
        );

        const layout = computed(() => props.computeLayout?.({ itemCount: placeCount.value }));

        const isSource = computed(() => carryState.value?.from === zone);

        const landingIndex = computed(() =>
            SortableUtils.computeLandingIndex(carryState.value?.to, carryState.value?.toPlace, sourceIndex.value, zone),
        );

        const markerPlacement = computed(() =>
            layout.value === undefined || landingIndex.value === undefined
                ? undefined
                : PlacementUtils.getGapPlacement(layout.value.placements, landingIndex.value),
        );

        watchAfterRender(
            [landingIndex, getOrientation, direction, () => viewportContext.getScale(), items],
            ([landing, orientation, textDirection, scale]) => {
                const root = rootRef.value;

                markerOffset.value =
                    landing === undefined || !root
                        ? undefined
                        : SortableUtils.computeMarkerOffset(root, getItemRects(), landing, {
                              orientation,
                              direction: textDirection,
                              scale,
                          });
            },
        );

        const navigable = computed(() => SortableUtils.computeNavigableIndexes(items.value));

        const getItemId = (index: number) => `${listId}-item-${index}`;

        const focusIndex = (index: number) => {
            focusedIndex.value = index;
            itemRefs[index]?.focus();
        };

        const pickUp = (index: number, mode: CarryMode, from?: Point2d) => {
            if (getIsDisabled()) return;

            const item = items.value[index];

            if (!item || item.isDisabled) return;

            const rect = itemRefs[index]?.getBoundingClientRect();

            if (rect) {
                const pickUpGeometry = SortableUtils.computePickUp(rect, viewportContext, from);

                carriedSize.value = pickUpGeometry.size;
                grabOffset = pickUpGeometry.grabOffset;
                carriedPoint.value = pickUpGeometry.point;
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

        const handlePointerDown = (index: number) => (e: PointerEvent) => {
            if (e.button !== 0 || getIsDisabled()) return;
            if ((e.target as HTMLElement).closest(CarrierUtils.INTERACTIVE_SELECTOR)) return;
            if (CarrierUtils.getCarry()) return;

            const element = itemRefs[index];

            if (!element) return;

            CarrierUtils.dragFromPointer(
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
                CarrierUtils.getCarry() ? CarrierUtils.getCarryMode() : undefined,
            );

            if (action === "pickUp") {
                pickUp(index, "tap", { x: e.clientX, y: e.clientY });
                focusIndex(index);

                return;
            }

            if (action === undefined) return;

            if (action === "aimAndDrop") {
                const rect = itemRefs[index]?.getBoundingClientRect();

                if (rect) CarrierUtils.aimAtPoint(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);
            }

            CarrierUtils.end("drop");
        };

        const handleKeyDown = (index: number) => (e: KeyboardEvent) => {
            if (getIsDisabled()) return;

            const action = SortableUtils.computeKeyAction(e.key, {
                index,
                isShifted: e.shiftKey,
                isCarrying: CarrierUtils.getCarry() !== undefined && CarrierUtils.getCarryMode() !== "drag",
                isPlaced: layout.value !== undefined,
                orientation: getOrientation(),
                direction: direction.value,
                navigable: navigable.value,
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

        const handleRootClick = (e: MouseEvent) => {
            const carry = CarrierUtils.getCarry();

            if (getIsDisabled() || !carry) return;

            const action = SortableUtils.computeClickAction(CarrierUtils.getCarryMode());

            if (action === undefined) return;
            if (e.target !== rootRef.value) return;
            if (!zone.computeCanAccept(carry) && !isSource.value) return;

            if (action === "aimAndDrop") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

            CarrierUtils.end("drop");
        };

        watchAfterRender([isSource], ([isCarrying]) => {
            if (!isCarrying) {
                carriedPoint.value = undefined;
                carriedSize.value = undefined;

                return;
            }

            const trackPoint = (e: PointerEvent) => {
                carriedPoint.value = ViewportUtils.getAdjustedClientPoint(
                    { x: e.clientX, y: e.clientY },
                    viewportContext,
                );

                if (CarrierUtils.getCarryMode() !== "tap") return;

                CarrierUtils.aimAtPoint(e.clientX, e.clientY);
            };

            document.addEventListener("pointermove", trackPoint, true);

            return () => document.removeEventListener("pointermove", trackPoint, true);
        });

        watchAfterRender([rootRef], ([root]) => {
            if (!root) return;

            const swallowClick = (e: MouseEvent) => {
                if (!hasPendingClick) return;

                hasPendingClick = false;

                e.preventDefault();
                e.stopPropagation();
            };

            root.addEventListener("click", swallowClick, true);

            return () => root.removeEventListener("click", swallowClick, true);
        });

        watchAfterRender([focusedIndex, () => items.value.length], ([focused, itemCount]) => {
            if (focused < itemCount) return;

            focusedIndex.value = Math.max(itemCount - 1, 0);
        });

        watchAfterRender([getIsDisabled, carryState], ([isDisabled, carry]) => {
            if (!isDisabled || !carry || carry.from !== zone) return;

            CarrierUtils.end("cancel");
        });

        onScopeDispose(() => {
            if (CarrierUtils.getSourceZone() === zone) CarrierUtils.end("cancel");
        });

        const elevationBase = ElevationVueUtils.useBase(rootRef);

        const renderItemAt = (item: SortableItem<T>, index: number) => {
            const placement = layout.value?.placements[index];
            const orientation = getOrientation();
            const rovingIndex = SortableUtils.computeRovingIndex(navigable.value, focusedIndex.value);
            const carriedKey = isSource.value ? carryState.value?.carry.key : undefined;
            const roleDescription = props.itemRoleDescription ?? SORTABLE_DEFAULTS.itemRoleDescription;

            const element = (
                <InteractionWrapper
                    sizing={
                        placement !== undefined ? PLACED_SIZING : orientation === "horizontal" ? "fit-content" : "fill"
                    }
                    isDisabled={item.isDisabled ?? false}
                    isReachableWhenDisabled={item.isReachableWhenDisabled ?? false}
                    isTabbable={rovingIndex === index}
                    tooltipDefs={item.tooltipDefs}
                    extraFlags={{
                        isCarried: carriedKey === props.computeItemKey(item.value),
                        isLandingBefore: landingIndex.value === index,
                    }}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags: itemFlags }) => (
                                <SortableItemSlot
                                    ref={(target: Element | ComponentPublicInstance | null) => {
                                        setElementRef(target);
                                        itemRefs[index] = toElement(target);
                                    }}
                                    id={getItemId(index)}
                                    hintId={hintId}
                                    label={props.computeItemLabel(item.value)}
                                    roleDescription={roleDescription}
                                    position={index + 1}
                                    setSize={items.value.length}
                                    flags={itemFlags}
                                    onPointerDown={handlePointerDown(index)}
                                    onKeyDown={handleKeyDown(index)}
                                    onClick={handleClick(index)}
                                    onFocus={() => {
                                        focusedIndex.value = index;
                                    }}
                                >
                                    {
                                        {
                                            renderContent: (contentFlags) =>
                                                callSlot(slots.renderItem, { item, flags: contentFlags }),
                                        } satisfies SortableItemSlotSlots
                                    }
                                </SortableItemSlot>
                            ),
                        } satisfies InteractionWrapperSlots<SortableItemFlags>
                    }
                </InteractionWrapper>
            );

            return placement ? (
                <PlacementItem key={index} placement={placement}>
                    {element}
                </PlacementItem>
            ) : (
                <Fragment key={index}>{element}</Fragment>
            );
        };

        const renderListContent = (): VNodeChild => (
            <>
                {items.value.map(renderItemAt)}

                {slots.renderMarker && markerPlacement.value && (
                    <PlacementItem placement={markerPlacement.value}>
                        <div class={SortableStyles.sortableMarkerPlaced} aria-hidden="true">
                            {callSlot(slots.renderMarker, getOrientation())}
                        </div>
                    </PlacementItem>
                )}
            </>
        );

        const renderMarker = (isHorizontal: boolean, endRoom: number): VNodeChild =>
            slots.renderMarker &&
            layout.value === undefined &&
            markerOffset.value !== undefined && (
                <div
                    class={isHorizontal ? SortableStyles.sortableMarkerRow : SortableStyles.sortableMarkerColumn}
                    style={
                        isHorizontal
                            ? { left: `${markerOffset.value}px`, top: `${endRoom}px`, bottom: `${endRoom}px` }
                            : { top: `${markerOffset.value}px`, left: `${endRoom}px`, right: `${endRoom}px` }
                    }
                    aria-hidden="true"
                >
                    {callSlot(slots.renderMarker, getOrientation())}
                </div>
            );

        const renderList: InteractionWrapperSlots<SortableFlags>["renderControl"] = ({ setElementRef }) => {
            const isHorizontal = getOrientation() === "horizontal";
            const gap = props.gap ?? SORTABLE_DEFAULTS.gap;
            const endRoom = gap * 0.5;
            const currentLayout = layout.value;

            return (
                <div
                    id={listId}
                    ref={(target) => {
                        rootRef.value = toElement(target);
                        setElementRef(target);
                    }}
                    class={isHorizontal ? SortableStyles.sortableRow : SortableStyles.sortableColumn}
                    style={{ gap: `${gap}px`, padding: `${endRoom}px` }}
                    role="list"
                    aria-label={ariaLabel.value}
                    aria-disabled={getIsDisabled() || undefined}
                    onClick={handleRootClick}
                >
                    {currentLayout ? (
                        <PlacementBox
                            ref={(target) => {
                                boxElement = toElement(target);
                            }}
                            layout={currentLayout}
                            computeEffect={props.computeEffect}
                        >
                            {renderListContent()}
                        </PlacementBox>
                    ) : (
                        renderListContent()
                    )}

                    {renderMarker(isHorizontal, endRoom)}
                </div>
            );
        };

        return () => {
            const carriedItem = carryState.value?.carry.value as SortableItem<T> | undefined;
            const carriedZIndex = Math.max(AnchorUtils.getStackingBase(rootRef.value), elevationBase.value) + 1;

            return (
                <>
                    <div id={hintId} class={SortableStyles.sortableHint}>
                        {props.announcements.restingKeyHint}
                    </div>

                    <InteractionWrapper
                        {...forwardProps(props, InteractionWrapper)}
                        sizing={layout.value !== undefined ? "fill" : (props.sizing ?? "fit-content")}
                        extraFlags={{
                            isCarrying: carryState.value !== undefined,
                            isReceiving: carryState.value?.to === zone,
                            isSource: isSource.value,
                            isEmpty: items.value.length < 1,
                        }}
                    >
                        {
                            {
                                renderDecoration: slots.renderDecoration,
                                renderControl: renderList,
                            } satisfies InteractionWrapperSlots<SortableFlags>
                        }
                    </InteractionWrapper>

                    {slots.renderCarried && isSource.value && carriedPoint.value && (
                        <Teleport to={viewportContext.getPortalRef() ?? document.body}>
                            <div
                                class={SortableStyles.sortableCarried}
                                style={{
                                    transform: `translate(${carriedPoint.value.x - grabOffset.x}px, ${carriedPoint.value.y - grabOffset.y}px)`,
                                    width: `${carriedSize.value?.width ?? 0}px`,
                                    height: `${carriedSize.value?.height ?? 0}px`,
                                    zIndex: carriedZIndex,
                                }}
                                aria-hidden="true"
                            >
                                {carriedItem && callSlot(slots.renderCarried, carriedItem)}
                            </div>
                        </Teleport>
                    )}
                </>
            );
        };
    },
    {
        name: "Sortable",
        inheritAttrs: false,
        slots: Object as SlotsType<SortableSlots<any>>,
        props: declareProps<SortableProps<unknown>>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "minWidth": null,
            "minHeight": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "groupId": null,
            "ariaLabel": null,
            "announcements": null,
            "itemRoleDescription": null,
            "orientation": null,
            "gap": null,
            "isLocked": Boolean,
            "items": null,
            "onUpdate:items": null,
            "computeLayout": null,
            "computeEffect": null,
            "computeItemKey": null,
            "computeItemLabel": null,
            "computeCanAccept": null,
            "onTransfer": null,
        }),
    },
);
