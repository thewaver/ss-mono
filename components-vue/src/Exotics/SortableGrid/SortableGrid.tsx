import {
    type ComponentPublicInstance,
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
import type { Point2d } from "@thewaver/ss-utils";

import { CarrierVueUtils } from "../../Abstracts/Carrier/CarrierVue.utils";
import { ElevationVueUtils } from "../../Abstracts/Elevation/ElevationVue.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { LabelVueUtils } from "../../Essentials/Input/Label/LabelVue.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionTooltipDefs,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type {
    SortableGridController,
    SortableGridItem,
    SortableGridItemSlotProps,
    SortableGridItemSlotSlots,
    SortableGridProps,
    SortableGridSlots,
} from "./SortableGrid.types";

const NO_BLOCKED_SPOTS: SortableGridSpot[] = [];

const SortableGridItemSlot = defineComponent(
    (props: SortableGridItemSlotProps, { slots }: SlotsContext<SortableGridItemSlotSlots>) => () => {
        const isDisabled = props.flags.isDisabled ?? false;

        return (
            <div
                id={props.id}
                class={SortableGridStyles.sortableGridItem}
                role="listitem"
                aria-label={props.label}
                aria-posinset={props.position}
                aria-setsize={props.setSize}
                aria-disabled={isDisabled || undefined}
                aria-describedby={props.hintId}
                onPointerdown={props.onPointerDown}
                onKeydown={props.onKeyDown}
                onClick={props.onClick}
                onFocusin={props.onFocus}
            >
                {props.cells.map((cell, index) => (
                    <div
                        key={index}
                        class={SortableGridStyles.sortableGridHit}
                        style={{
                            left: `${cell.left}px`,
                            top: `${cell.top}px`,
                            width: `${cell.width}px`,
                            height: `${cell.height}px`,
                        }}
                        aria-hidden="true"
                    />
                ))}

                {callSlot(slots.renderContent, props.flags)}
            </div>
        );
    },
    {
        name: "SortableGridItemSlot",
        slots: Object as SlotsType<SortableGridItemSlotSlots>,
        props: declareProps<SortableGridItemSlotProps>({
            id: null,
            hintId: null,
            label: null,
            position: null,
            setSize: null,
            cells: null,
            flags: null,
            onPointerDown: null,
            onKeyDown: null,
            onClick: null,
            onFocus: null,
        }),
    },
);

export const SortableGrid = defineComponent(
    <T,>(props: SortableGridProps<T>, { slots }: SlotsContext<SortableGridSlots<T>>) => {
        const items = useTwoWay(props, "items");

        const gridId = useId();
        const hintId = useId();

        const viewportContext = useViewportContext();

        const rootRef = shallowRef<HTMLElement>();
        const itemRefs: Array<HTMLElement | undefined> = [];

        let grabOffset: Point2d = { x: 0, y: 0 };
        let hasPendingClick = false;
        let writtenItems = items.value;

        watchAfterRender([items], ([value]) => {
            writtenItems = value;
        });

        const writeItems = (next: SortableGridItem<T>[]) => {
            writtenItems = next;
            items.value = next;
        };

        const focusedIndex = shallowRef(0);
        const carriedPoint = shallowRef<Point2d>();

        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);

        const getIsDisabled = () => props.isDisabled ?? false;
        const getIsTurnable = () => props.isTurnable ?? false;
        const getGap = () => props.gap ?? SORTABLE_GRID_DEFAULTS.gap;

        const carryState = CarrierVueUtils.useCarry();
        const isTargetAllowed = CarrierVueUtils.useIsTargetAllowed();

        const cells = computed(() => SortableGridUtils.getSpots(props.columns, props.rows));

        const blockedSpots = computed(() => {
            const computeIsSpotBlocked = props.computeIsSpotBlocked;

            return computeIsSpotBlocked === undefined
                ? NO_BLOCKED_SPOTS
                : cells.value.filter((spot) => computeIsSpotBlocked(spot));
        });

        const getSpan = (count: number) => SortableGridUtils.getSpan(count, props.cellSize, getGap());
        const getOffset = (cell: number) => SortableGridUtils.getOffset(cell, props.cellSize, getGap());
        const getGeometry = (shape: SortableGridShape) =>
            SortableGridUtils.getGeometry(shape, props.cellSize, getGap());

        const zone: CarrierZone = CarrierVueUtils.useZone(
            SortableGridUtils.createZone<T, InteractionTooltipDefs<SortableGridItemFlags>>({
                getZone: () => zone,
                getItems: () => items.value,
                updateItems: (update) => writeItems(update(writtenItems)),
                getGroupId: () => props.groupId,
                getLabel: () => props.ariaLabel,
                getRootRef: () => rootRef.value,
                getIsDisabled,
                getIsLocked: () => props.isLocked ?? false,
                getIsTurnable,
                getAnnouncements: () => props.announcements,
                getColumns: () => props.columns,
                getRows: () => props.rows,
                getCellSize: () => props.cellSize,
                getGap,
                getScale: () => viewportContext.getScale(),
                getBlockedSpots: () => blockedSpots.value,
                computeItemKey: (value) => props.computeItemKey(value),
                computeCanAccept: (value, fromLabel) => props.computeCanAccept?.(value, fromLabel) ?? true,
                onTransfer: (transfer) => props.onTransfer?.(transfer),
            }),
        );

        const isSource = computed(() => carryState.value !== undefined && carryState.value.from === zone);
        const isReceiving = computed(() => carryState.value !== undefined && carryState.value.to === zone);

        const turn = (step: number) => {
            if (!getIsTurnable() || !isSource.value) return false;

            CarrierUtils.aimAtNudge({ turn: step });

            return true;
        };

        const controller: SortableGridController = {
            getIsCarrying: () => isSource.value,
            turnCw: () => turn(1),
            turnCcw: () => turn(-1),
            compact: () => {
                if (CarrierUtils.getCarry() && (isSource.value || isReceiving.value)) return false;

                const current = writtenItems;
                const compacted = SortableGridUtils.getCompacted(current, blockedSpots.value);

                if (compacted.every((item, index) => item === current[index])) return false;

                writeItems(compacted);

                return true;
            },
        };

        const navigable = computed(() => SortableUtils.computeNavigableIndexes(items.value));
        const boxes = computed(() => items.value.map(SortableGridUtils.getItemBox));

        const getItemId = (index: number) => `${gridId}-item-${index}`;

        const focusIndex = (index: number) => {
            focusedIndex.value = index;
            itemRefs[index]?.focus();
        };

        const pickUp = (index: number, mode: CarryMode, from?: Point2d) => {
            if (getIsDisabled()) return;

            const item = items.value[index];

            if (!item || item.isDisabled) return;

            const pickUpGeometry = SortableGridUtils.computePickUp(
                itemRefs[index]?.getBoundingClientRect(),
                viewportContext,
                SortableGridUtils.getItemShape(item),
                { cellSize: props.cellSize, gap: getGap(), from },
            );

            grabOffset = pickUpGeometry.grabOffset;
            carriedPoint.value = pickUpGeometry.point;

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
            if (action === "aimAndDrop") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

            CarrierUtils.end("drop");
        };

        const handleKeyDown = (index: number) => (e: KeyboardEvent) => {
            if (getIsDisabled()) return;

            const action = SortableGridUtils.computeKeyAction(e.key, {
                index,
                isShifted: e.shiftKey,
                isCarrying: CarrierUtils.getCarry() !== undefined && CarrierUtils.getCarryMode() !== "drag",
                navigable: navigable.value,
                boxes: boxes.value,
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
            if (CarrierUtils.getCarryMode() === "drag") return;
            if (e.target !== rootRef.value) return;
            if (!zone.computeCanAccept(carry) && !isSource.value) return;

            if (CarrierUtils.getCarryMode() === "key") CarrierUtils.aimAtPoint(e.clientX, e.clientY);

            CarrierUtils.end("drop");
        };

        watchAfterRender([isSource], ([isCarrying]) => {
            if (!isCarrying) {
                carriedPoint.value = undefined;

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

        watchAfterRender([getIsDisabled, isSource], ([isDisabled, isCarrying]) => {
            if (!isDisabled || !isCarrying) return;

            CarrierUtils.end("cancel");
        });

        onScopeDispose(() => {
            if (CarrierUtils.getSourceZone() === zone) CarrierUtils.end("cancel");
        });

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        const elevationBase = ElevationVueUtils.useBase(rootRef);

        const renderCells = (): VNodeChild => {
            const gap = getGap();

            return (
                <div
                    class={SortableGridStyles.sortableGridCells}
                    style={{
                        left: `${gap}px`,
                        top: `${gap}px`,
                        gap: `${gap}px`,
                        gridTemplateColumns: `repeat(${props.columns}, ${props.cellSize}px)`,
                        gridAutoRows: `${props.cellSize}px`,
                    }}
                    aria-hidden="true"
                >
                    {cells.value.map((spot, index) => (
                        <div key={index} class={SortableGridStyles.sortableGridCell}>
                            {callSlot(slots.renderCell, {
                                spot,
                                flags: { isBlocked: props.computeIsSpotBlocked?.(spot) ?? false },
                            })}
                        </div>
                    ))}
                </div>
            );
        };

        const renderItemAt = (item: SortableGridItem<T>, index: number): VNodeChild => {
            const geometry = getGeometry(SortableGridUtils.getItemShape(item));
            const carriedKey = isSource.value ? carryState.value?.carry.key : undefined;
            const readingOrder = SortableGridUtils.getReadingOrder(boxes.value);
            const rovingIndex = SortableUtils.computeRovingIndex(navigable.value, focusedIndex.value);

            return (
                <div
                    key={index}
                    class={SortableGridStyles.sortableGridSlot}
                    style={{
                        left: `${getOffset(item.spot.col)}px`,
                        top: `${getOffset(item.spot.row)}px`,
                        width: `${getSpan(geometry.size.colCount)}px`,
                        height: `${getSpan(geometry.size.rowCount)}px`,
                    }}
                >
                    <InteractionWrapper
                        sizing={"fill"}
                        isDisabled={item.isDisabled ?? false}
                        isReachableWhenDisabled={item.isReachableWhenDisabled ?? false}
                        isTabbable={rovingIndex === index}
                        tooltipDefs={item.tooltipDefs}
                        extraFlags={{ isCarried: carriedKey === props.computeItemKey(item.value) }}
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags: itemFlags }) => (
                                    <SortableGridItemSlot
                                        ref={(target: Element | ComponentPublicInstance | null) => {
                                            itemRefs[index] = toElement(target);
                                            setElementRef(target);
                                        }}
                                        id={getItemId(index)}
                                        hintId={hintId}
                                        label={SortableGridUtils.computeItemLabel(
                                            props.computeItemLabel(item.value),
                                            item,
                                        )}
                                        position={readingOrder.indexOf(index) + 1}
                                        setSize={items.value.length}
                                        cells={geometry.cells}
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
                                                    callSlot(slots.renderItem, {
                                                        item,
                                                        flags: contentFlags,
                                                        geometry,
                                                    }),
                                            } satisfies SortableGridItemSlotSlots
                                        }
                                    </SortableGridItemSlot>
                                ),
                            } satisfies InteractionWrapperSlots<SortableGridItemFlags>
                        }
                    </InteractionWrapper>
                </div>
            );
        };

        const renderLanding = (): VNodeChild => {
            const state = carryState.value;
            const landingPlace = isReceiving.value ? (state?.toPlace as SortableGridPlace | undefined) : undefined;

            if (!slots.renderLanding || !state || !landingPlace) return null;

            const landingGeometry = getGeometry(SortableGridUtils.getCarriedShape(state.carry, landingPlace.turns));

            return (
                <div
                    class={SortableGridStyles.sortableGridLanding}
                    style={{
                        left: `${getOffset(landingPlace.col)}px`,
                        top: `${getOffset(landingPlace.row)}px`,
                        width: `${getSpan(landingGeometry.size.colCount)}px`,
                        height: `${getSpan(landingGeometry.size.rowCount)}px`,
                    }}
                    aria-hidden="true"
                >
                    {callSlot(slots.renderLanding, { isAllowed: isTargetAllowed.value, geometry: landingGeometry })}
                </div>
            );
        };

        const renderGrid: InteractionWrapperSlots<SortableGridFlags>["renderControl"] = ({ setElementRef }) => (
            <div
                id={gridId}
                ref={(target) => {
                    rootRef.value = toElement(target);
                    setElementRef(target);
                }}
                class={SortableGridStyles.sortableGridRoot}
                style={{
                    width: `${SortableGridUtils.getExtent(props.columns, props.cellSize, getGap())}px`,
                    height: `${SortableGridUtils.getExtent(props.rows, props.cellSize, getGap())}px`,
                }}
                role="list"
                aria-label={ariaLabel.value}
                aria-disabled={getIsDisabled() || undefined}
                onClick={handleRootClick}
            >
                {slots.renderCell && renderCells()}

                {items.value.map(renderItemAt)}

                {renderLanding()}
                <div id={hintId} class={SortableGridStyles.sortableGridHint}>
                    {props.announcements.restingKeyHint}
                </div>
            </div>
        );

        const renderCarried = (): VNodeChild => {
            const state = carryState.value;
            const point = carriedPoint.value;

            if (!slots.renderCarried || !isSource.value || !state || !point) return null;

            const carriedItem = state.carry.value as SortableGridItem<T> | undefined;
            const carriedGeometry = getGeometry(
                SortableGridUtils.getCarriedShape(
                    state.carry,
                    SortableGridUtils.getAimedTurns(state.carry, state.toPlace),
                ),
            );
            const carriedZIndex = Math.max(AnchorUtils.getStackingBase(rootRef.value), elevationBase.value) + 1;

            return (
                <Teleport to={viewportContext.getPortalRef() ?? document.body}>
                    <div
                        class={SortableGridStyles.sortableGridCarried}
                        style={{
                            transform: `translate(${point.x - grabOffset.x}px, ${point.y - grabOffset.y}px)`,
                            width: `${getSpan(carriedGeometry.size.colCount)}px`,
                            height: `${getSpan(carriedGeometry.size.rowCount)}px`,
                            zIndex: carriedZIndex,
                        }}
                        aria-hidden="true"
                    >
                        {carriedItem && callSlot(slots.renderCarried, { item: carriedItem, geometry: carriedGeometry })}
                    </div>
                </Teleport>
            );
        };

        return () => (
            <>
                <InteractionWrapper
                    {...forwardProps(props, InteractionWrapper)}
                    extraFlags={{
                        isCarrying: carryState.value !== undefined,
                        isReceiving: isReceiving.value,
                        isSource: isSource.value,
                        isEmpty: items.value.length < 1,
                    }}
                >
                    {
                        {
                            renderDecoration: slots.renderDecoration,
                            renderControl: renderGrid,
                        } satisfies InteractionWrapperSlots<SortableGridFlags>
                    }
                </InteractionWrapper>

                {renderCarried()}
            </>
        );
    },
    {
        name: "SortableGrid",
        inheritAttrs: false,
        slots: Object as SlotsType<SortableGridSlots<any>>,
        props: declareProps<SortableGridProps<unknown>>({
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
            "columns": null,
            "rows": null,
            "cellSize": null,
            "gap": null,
            "isLocked": Boolean,
            "isTurnable": Boolean,
            "computeIsSpotBlocked": null,
            "items": null,
            "onUpdate:items": null,
            "computeItemKey": null,
            "computeItemLabel": null,
            "computeCanAccept": null,
            "onTransfer": null,
            "onMount": null,
        }),
    },
);
