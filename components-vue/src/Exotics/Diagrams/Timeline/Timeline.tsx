import {
    type ComponentPublicInstance,
    type SlotsType,
    type VNodeChild,
    computed,
    defineComponent,
    onMounted,
    onScopeDispose,
    onUpdated,
    shallowRef,
    useId,
} from "vue";

import {
    CarrierUtils,
    type CarryMode,
    LiveAnnouncerUtils,
    TIMELINE_DEFAULTS,
    type TimelineEdge,
    type TimelineItemRenderProps,
    type TimelineSpan,
    TimelineStyles,
    TimelineUtils,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { CarrierVueUtils } from "../../../Abstracts/Carrier/CarrierVue.utils";
import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type { InteractionWrapperSlots } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type {
    TimelineController,
    TimelineItemProps,
    TimelineItemSlots,
    TimelineProps,
    TimelineSlots,
} from "./Timeline.types";

const DEFAULT_FOCUS_RATIO = 0.5;
const MIN_VIEW_SHARE = 0.001;
const PERCENT = 100;
const NOTHING = 0;
const FIRST_ARIA_POSITION = 1;
const ROVING_TAB_INDEX = 0;
const NO_MARKERS: number[] = [];
const DEFAULT_EDGE: TimelineEdge = "end";

const getIsSameSpan = (a: TimelineSpan, b: TimelineSpan) => a.start === b.start && a.end === b.end;

const TimelineItem = defineComponent(
    (props: TimelineItemProps, { slots }: SlotsContext<TimelineItemSlots>) =>
        () => {
            const isDisabled = props.flags.isDisabled ?? false;

            return (
                <div
                    id={props.id}
                    class={TimelineStyles.timelineControl}
                    role="button"
                    aria-label={props.ariaLabel}
                    aria-describedby={props.ariaDescribedBy}
                    aria-disabled={isDisabled || undefined}
                    onFocusin={() => props.onFocused()}
                    onClick={() => {
                        if (isDisabled) return;

                        props.onActivate();
                    }}
                >
                    {callSlot(slots.renderContent, props.flags)}
                </div>
            );
        },
    {
        name: "TimelineItem",
        slots: Object as SlotsType<TimelineItemSlots>,
        props: declareProps<TimelineItemProps>({
            id: null,
            ariaLabel: null,
            ariaDescribedBy: null,
            flags: null,
            onActivate: null,
            onFocused: null,
        }),
    },
);

export const Timeline = defineComponent(
    <T,>(props: TimelineProps<T>, { slots }: SlotsContext<TimelineSlots<T>>) => {
        watchAfterRender([], () => LiveAnnouncerUtils.reserve("polite"));

        const timelineId = useId();
        const hintId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const itemRefs = new Map<number, HTMLElement>();

        let isFocusFollowing = false;
        let edgeGrabOffset = NOTHING;

        const focusedIndex = shallowRef<number>();
        const heldEdge = shallowRef<TimelineEdge>(DEFAULT_EDGE);

        const size = ElementObserverVueUtils.useBorderBoxSize(rootRef);

        const getMinViewExtent = () => props.minViewExtent ?? TimelineUtils.getExtent(props.range) * MIN_VIEW_SHARE;

        const rawView = useTwoWay(props, "view", props.range);

        const view = computed<TimelineSpan>((previous) => {
            const next = TimelineUtils.clampView(rawView.value, props.range, getMinViewExtent());

            return previous && getIsSameSpan(previous, next) ? previous : next;
        });

        let latestView = view.value;

        watchAfterRender([view], ([current]) => {
            latestView = current;
        });

        const spans = computed(() => props.items.map((item, index) => props.computeSpan(item, index)));

        const lanes = computed(() => {
            const computeLane = props.computeLane;

            return computeLane === undefined
                ? TimelineUtils.packLanes(spans.value)
                : props.items.map((item, index) => computeLane(item, index));
        });

        const getIsDisabled = () => props.isDisabled ?? false;

        const getIsItemDisabled = (index: number) =>
            getIsDisabled() || (props.computeIsItemDisabled?.(props.items[index], index) ?? false);

        const getIsEditable = () => props.onSpanChange !== undefined && !getIsDisabled();
        const getEdgeAnnouncements = () => props.edgeAnnouncements ?? TIMELINE_DEFAULTS.edgeAnnouncements;
        const getIsPannable = () => (props.isPannable ?? true) && !getIsDisabled();
        const getIsZoomable = () => (props.isZoomable ?? true) && !getIsDisabled();

        const steps = computed(() =>
            TimelineUtils.chooseSteps(
                TimelineUtils.getExtent(view.value),
                size.value.width,
                props.minTickGap ?? TIMELINE_DEFAULTS.minTickGap,
                props.tickSteps,
            ),
        );

        const getPointerRatio = (clientX: number) =>
            TimelineUtils.computePointerRatio(clientX, rootRef.value?.getBoundingClientRect());

        const zone = CarrierVueUtils.useZone(
            TimelineUtils.createEdgeZone({
                getGroupId: () => timelineId,
                getLabel: () => props.ariaLabel ?? "",
                getRootRef: () => rootRef.value,
                getIsEditable,
                getAnnouncements: getEdgeAnnouncements,
                getHeldEdge: () => heldEdge.value,
                getGrabOffset: () => edgeGrabOffset,
                getView: () => latestView,
                getRange: () => props.range,
                getSpans: () => spans.value,
                getStep: () => steps.value.step,
                computePointerRatio: getPointerRatio,
                get computeSnapValue() {
                    return props.computeSnapValue;
                },
                onSpanChange: (index, span) => props.onSpanChange?.(props.items[index], index, span),
            }),
        );

        const carryState = CarrierVueUtils.useCarry();

        const edgeCarry = computed(() => (carryState.value?.from === zone ? carryState.value.carry : undefined));

        const heldIndex = computed(() => TimelineUtils.getCarriedIndex(edgeCarry.value));

        const shownSpans = computed(() =>
            TimelineUtils.computeShownSpans(
                spans.value,
                heldIndex.value,
                carryState.value?.toPlace as TimelineSpan | undefined,
            ),
        );

        const order = computed(() => TimelineUtils.computeOrder(spans.value, lanes.value));

        const placements = computed(() =>
            TimelineUtils.computePlacements(shownSpans.value, lanes.value, order.value, view.value),
        );

        const stops = computed(() =>
            TimelineUtils.computeStops(
                spans.value,
                lanes.value,
                order.value,
                props.items.map((_unused, index) => getIsItemDisabled(index)),
            ),
        );

        const rovingIndex = computed(() => TimelineUtils.computeRovingIndex(stops.value, focusedIndex.value));

        const setView = (next: TimelineSpan) => {
            const clamped = TimelineUtils.clampView(next, props.range, getMinViewExtent());

            if (getIsSameSpan(clamped, latestView)) return false;

            latestView = clamped;
            rawView.value = clamped;

            return true;
        };

        const controller: TimelineController = {
            getView: () => view.value,
            zoomBy: (factor, focusRatio) =>
                setView(
                    TimelineUtils.zoomView(
                        latestView,
                        factor,
                        focusRatio ?? DEFAULT_FOCUS_RATIO,
                        props.range,
                        getMinViewExtent(),
                    ),
                ),
            panBy: (ratio) => setView(TimelineUtils.panView(latestView, ratio, props.range)),
            showSpan: (span) => setView(TimelineUtils.revealView(span, latestView, props.range)),
        };

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        const gestures = TimelineUtils.createGestureTracker({
            getIsPannable,
            getIsZoomable,
            getWidth: () => size.value.width,
            computePointerRatio: getPointerRatio,
            zoomBy: (factor, focusRatio) => controller.zoomBy(factor, focusRatio),
            panBy: (ratio) => controller.panBy(ratio),
        });

        const followFocus = () => {
            const index = rovingIndex.value;
            const element = index === undefined ? undefined : itemRefs.get(index);

            if (!isFocusFollowing || element === undefined) return;

            isFocusFollowing = false;
            element.tabIndex = ROVING_TAB_INDEX;
            element.focus();
        };

        onMounted(followFocus);
        onUpdated(followFocus);

        const getEdgeCarry = () => (CarrierUtils.getSourceZone() === zone ? CarrierUtils.getCarry() : undefined);

        const moveTo = (index: number) => {
            isFocusFollowing = rootRef.value?.contains(document.activeElement) ?? false;

            focusedIndex.value = index;
            setView(TimelineUtils.revealView(spans.value[index], latestView, props.range));
        };

        const activateItem = (index: number) => {
            if (getIsItemDisabled(index)) return;

            focusedIndex.value = index;
            props.onItemActivate?.(props.items[index], index);
        };

        const focusItem = (index: number) => {
            const element = itemRefs.get(index);

            focusedIndex.value = index;

            if (element === undefined) return;

            element.tabIndex = ROVING_TAB_INDEX;
            element.focus();
        };

        const pickUpEdge = (index: number, edge: TimelineEdge, mode: CarryMode, from?: Point2d) => {
            if (!getIsEditable() || getIsItemDisabled(index)) return;

            const span = spans.value[index];

            edgeGrabOffset =
                from === undefined ? NOTHING : TimelineUtils.toValue(getPointerRatio(from.x), latestView) - span[edge];

            heldEdge.value = edge;

            CarrierUtils.start(
                zone,
                span,
                TimelineUtils.computeEdgeCarry(
                    timelineId,
                    index,
                    props.computeItemAriaLabel?.(props.items[index], index) ?? "",
                ),
                mode,
            );
        };

        const revealHeldEdge = () => {
            const place = CarrierUtils.getTargetPlace() as TimelineSpan | undefined;

            if (place === undefined) return;

            const value = place[heldEdge.value];

            setView(TimelineUtils.revealView({ start: value, end: value }, latestView, props.range));
        };

        const holdEdge = (edge: TimelineEdge) => {
            const carry = getEdgeCarry();
            const place = CarrierUtils.getTargetPlace();

            if (!carry || place === undefined || edge === heldEdge.value) return;

            heldEdge.value = edge;

            LiveAnnouncerUtils.announce(
                getEdgeAnnouncements().computeAimed(zone.computePlaceLabel(place, carry), zone.getLabel()),
            );
        };

        const handleEdgePointerDown = (index: number, edge: TimelineEdge, e: PointerEvent) => {
            if (!TimelineUtils.getIsPrimaryPress(e)) return;

            e.stopPropagation();

            const root = rootRef.value;

            if (!root || CarrierUtils.getCarry()) return;

            CarrierUtils.dragFromPointer(root, e, (from) => pickUpEdge(index, edge, "drag", from));
        };

        const handleEdgeClick = (index: number, edge: TimelineEdge, e: MouseEvent) => {
            e.stopPropagation();

            if (CarrierUtils.getCarry()) return;

            pickUpEdge(index, edge, "tap");
            focusItem(index);
        };

        const handleBlur = (e: FocusEvent) => {
            if (!getEdgeCarry() || CarrierUtils.getCarryMode() !== "key") return;
            if (rootRef.value?.contains(e.relatedTarget as Node | null)) return;

            CarrierUtils.end("cancel");
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const from = rovingIndex.value;

            if (from === undefined || getIsDisabled()) return;

            const action = TimelineUtils.computeKeyAction(e.key, {
                isHolding: !!getEdgeCarry() && CarrierUtils.getCarryMode() !== "drag",
                isEditable: getIsEditable(),
            });

            if (action === undefined || action.kind === "ignore") return;

            if (action.kind === "step") {
                const next = TimelineUtils.computeStepIndex(action.step, from, stops.value);

                if (next === undefined) return;

                e.preventDefault();
                moveTo(next);

                return;
            }

            e.preventDefault();

            if (action.kind === "cancel") CarrierUtils.end("cancel");
            if (action.kind === "drop") CarrierUtils.end("drop");
            if (action.kind === "hold") pickUpEdge(from, "end", "key");
            if (action.kind === "activate") activateItem(from);

            if (action.kind !== "aim") return;

            if (action.edge !== undefined) holdEdge(action.edge);
            if (action.nudge !== undefined) CarrierUtils.aimAtNudge({ x: action.nudge });

            revealHeldEdge();
        };

        const isEdgeCarried = computed(() => edgeCarry.value !== undefined);

        watchAfterRender([rootRef], ([root]) => {
            if (!root) return;

            const handleWheel = (e: WheelEvent) => gestures.wheel(e);

            root.addEventListener("wheel", handleWheel, { passive: false });

            return () => root.removeEventListener("wheel", handleWheel);
        });

        watchAfterRender([isEdgeCarried], ([isCarried]) => {
            if (!isCarried) return;

            const trackPoint = (e: PointerEvent) => {
                if (CarrierUtils.getCarryMode() !== "tap") return;

                CarrierUtils.aimAtPoint(e.clientX, e.clientY);
            };

            document.addEventListener("pointermove", trackPoint, true);

            return () => document.removeEventListener("pointermove", trackPoint, true);
        });

        watchAfterRender([rootRef], ([root]) => {
            if (!root) return;

            const dropAtClick = (e: MouseEvent) => {
                if (CarrierUtils.getSourceZone() !== zone || !CarrierUtils.getCarry()) return;
                if (CarrierUtils.getCarryMode() === "drag") return;

                e.preventDefault();
                e.stopPropagation();

                CarrierUtils.aimAtPoint(e.clientX, e.clientY);
                CarrierUtils.end("drop");
            };

            root.addEventListener("click", dropAtClick, true);

            return () => root.removeEventListener("click", dropAtClick, true);
        });

        watchAfterRender([getIsEditable, isEdgeCarried], ([isEditable, isCarried]) => {
            if (isEditable || !isCarried) return;

            CarrierUtils.end("cancel");
        });

        onScopeDispose(() => {
            if (CarrierUtils.getSourceZone() === zone) CarrierUtils.end("cancel");
        });

        const renderItem = (index: number): VNodeChild => {
            const placementMap = new Map(placements.value.map((placement) => [placement.index, placement]));
            const placement = placementMap.get(index) ?? TimelineUtils.getBlankPlacement(index);
            const axisSize = props.axisSize ?? TIMELINE_DEFAULTS.axisSize;
            const laneGap = props.laneGap ?? TIMELINE_DEFAULTS.laneGap;
            const box = TimelineUtils.computeItemBox(placement, axisSize, props.laneSize, laneGap);
            const isItemDisabled = getIsItemDisabled(index);
            const isEditable = getIsEditable();
            const edgeGrabSize = props.edgeGrabSize ?? TIMELINE_DEFAULTS.edgeGrabSize;

            return (
                <li
                    key={index}
                    class={TimelineStyles.timelineItem}
                    style={{
                        left: `${box.left}%`,
                        width: `${box.width}%`,
                        top: `${box.top}px`,
                        height: `${box.height}px`,
                    }}
                    aria-posinset={placement.order + FIRST_ARIA_POSITION}
                    aria-setsize={props.items.length}
                >
                    <InteractionWrapper
                        sizing="fill"
                        isDisabled={isItemDisabled}
                        isTabbable={index === rovingIndex.value}
                        extraFlags={{
                            index,
                            placement,
                            span: shownSpans.value[index],
                            isFocused: focusedIndex.value === index,
                            heldEdge: heldIndex.value === index ? heldEdge.value : undefined,
                        }}
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags }) => (
                                    <TimelineItem
                                        id={`${timelineId}-item-${index}`}
                                        ref={(target: Element | ComponentPublicInstance | null) => {
                                            const element = toElement(target);

                                            if (element) itemRefs.set(index, element);
                                            else itemRefs.delete(index);

                                            setElementRef(target);
                                        }}
                                        ariaLabel={props.computeItemAriaLabel?.(props.items[index], index)}
                                        ariaDescribedBy={isEditable ? hintId : undefined}
                                        flags={flags}
                                        onActivate={() => activateItem(index)}
                                        onFocused={() => {
                                            focusedIndex.value = index;
                                        }}
                                    >
                                        {
                                            {
                                                renderContent: (itemFlags) =>
                                                    callSlot(slots.renderItem, {
                                                        item: props.items[index],
                                                        flags: itemFlags,
                                                    }),
                                            } satisfies TimelineItemSlots
                                        }
                                    </TimelineItem>
                                ),
                            } satisfies InteractionWrapperSlots<TimelineItemRenderProps>
                        }
                    </InteractionWrapper>

                    {isEditable && !isItemDisabled && (
                        <>
                            <div
                                class={TimelineStyles.timelineEdge}
                                style={{ left: `${-edgeGrabSize * 0.5}px`, width: `${edgeGrabSize}px` }}
                                aria-hidden="true"
                                onPointerdown={(e) => handleEdgePointerDown(index, "start", e)}
                                onClick={(e) => handleEdgeClick(index, "start", e)}
                            />

                            <div
                                class={TimelineStyles.timelineEdge}
                                style={{ right: `${-edgeGrabSize * 0.5}px`, width: `${edgeGrabSize}px` }}
                                aria-hidden="true"
                                onPointerdown={(e) => handleEdgePointerDown(index, "end", e)}
                                onClick={(e) => handleEdgeClick(index, "end", e)}
                            />
                        </>
                    )}
                </li>
            );
        };

        return () => {
            const laneCount = props.laneCount ?? TimelineUtils.computeLaneCount(lanes.value);
            const laneGap = props.laneGap ?? TIMELINE_DEFAULTS.laneGap;
            const axisSize = props.axisSize ?? TIMELINE_DEFAULTS.axisSize;
            const height = TimelineUtils.computeHeight(axisSize, laneCount, props.laneSize, laneGap);
            const isPannable = getIsPannable();
            const isZoomable = getIsZoomable();
            const renderedIndices = TimelineUtils.computeRenderedIndices(placements.value, rovingIndex.value);
            const ticks = TimelineUtils.computeTicks(view.value, steps.value);
            const markers = TimelineUtils.computeMarkers(props.markers ?? NO_MARKERS, view.value);

            return (
                <div
                    ref={rootRef}
                    id={timelineId}
                    class={TimelineStyles.timelineRoot}
                    style={{
                        height: `${height}px`,
                        touchAction: isPannable || isZoomable ? "pan-y" : undefined,
                    }}
                    onKeydown={handleKeyDown}
                    onFocusout={handleBlur}
                    onPointerdown={(e) => gestures.press(e)}
                    onPointermove={(e) => gestures.move(e, e.currentTarget as HTMLElement)}
                    onPointerup={(e) => gestures.release(e, e.currentTarget as HTMLElement)}
                    onPointercancel={(e) => gestures.release(e, e.currentTarget as HTMLElement)}
                >
                    <div class={TimelineStyles.timelineTicks} aria-hidden="true">
                        {ticks.map((tick, index) => (
                            <div
                                key={index}
                                class={TimelineStyles.timelineTick}
                                style={{ left: `${tick.ratio * PERCENT}%` }}
                            >
                                {callSlot(slots.renderTick, tick)}
                            </div>
                        ))}
                    </div>

                    {getIsEditable() && (
                        <div id={hintId} class={TimelineStyles.timelineHint}>
                            {getEdgeAnnouncements().restingKeyHint}
                        </div>
                    )}

                    <ul class={TimelineStyles.timelineList} role="list" aria-label={props.ariaLabel}>
                        {renderedIndices.map(renderItem)}
                    </ul>

                    <div class={TimelineStyles.timelineMarkers} aria-hidden="true">
                        {markers.map((marker, index) => (
                            <div
                                key={index}
                                class={TimelineStyles.timelineMarker}
                                style={{ left: `${marker.ratio * PERCENT}%` }}
                            >
                                {callSlot(slots.renderMarker, { marker, index })}
                            </div>
                        ))}
                    </div>
                </div>
            );
        };
    },
    {
        name: "Timeline",
        slots: Object as SlotsType<TimelineSlots<any>>,
        props: declareProps<TimelineProps<unknown>>({
            "range": null,
            "items": null,
            "laneSize": null,
            "laneGap": null,
            "axisSize": null,
            "laneCount": null,
            "minViewExtent": null,
            "tickSteps": null,
            "minTickGap": null,
            "ariaLabel": null,
            "markers": null,
            "edgeGrabSize": null,
            "edgeAnnouncements": null,
            "isPannable": Boolean,
            "isZoomable": Boolean,
            "isDisabled": Boolean,
            "view": null,
            "onUpdate:view": null,
            "computeSpan": null,
            "computeSnapValue": null,
            "computeLane": null,
            "computeItemAriaLabel": null,
            "computeIsItemDisabled": null,
            "onSpanChange": null,
            "onItemActivate": null,
            "onMount": null,
        }),
    },
);
