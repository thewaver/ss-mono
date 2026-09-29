import {
    type FocusEvent,
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
import { type Point2d, StoreUtils } from "@thewaver/ss-utils";

import { CarrierReactUtils } from "../../Abstracts/Carrier/CarrierReact.utils";
import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { useLatest } from "../../Utils/refUtils";
import type { TimelineController, TimelineItemProps, TimelineProps } from "./Timeline.types";

const DEFAULT_FOCUS_RATIO = 0.5;
const MIN_VIEW_SHARE = 0.001;
const PERCENT = 100;
const NOTHING = 0;
const FIRST_ARIA_POSITION = 1;
const ROVING_TAB_INDEX = 0;
const NO_MARKERS: number[] = [];
const DEFAULT_EDGE: TimelineEdge = "end";

const getIsSameSpan = (a: TimelineSpan, b: TimelineSpan) => a.start === b.start && a.end === b.end;

const TimelineItem = (props: TimelineItemProps) => {
    const isDisabled = props.flags.isDisabled ?? false;

    return (
        <div
            id={props.id}
            ref={props.ref}
            className={TimelineStyles.timelineControl}
            role="button"
            aria-label={props.ariaLabel}
            aria-describedby={props.ariaDescribedBy}
            aria-disabled={isDisabled || undefined}
            onFocus={() => props.onFocused()}
            onClick={() => {
                if (isDisabled) return;

                props.onActivate();
            }}
        >
            {props.renderContent(props.flags)}
        </div>
    );
};

export const Timeline = <T,>(props: TimelineProps<T>) => {
    useEffect(() => LiveAnnouncerUtils.reserve("polite"), []);

    const timelineId = useId();
    const hintId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef(new Map<number, HTMLElement>());
    const isFocusFollowingRef = useRef(false);
    const edgeGrabOffsetRef = useRef(NOTHING);
    const heldEdgeRef = useRef<TimelineEdge>(DEFAULT_EDGE);

    const [focusedIndex, setFocusedIndex] = useState<number>();
    const [heldEdge, setHeldEdgeState] = useState<TimelineEdge>(DEFAULT_EDGE);

    const setHeldEdge = (edge: TimelineEdge) => {
        heldEdgeRef.current = edge;
        setHeldEdgeState(edge);
    };

    const size = ElementObserverReactUtils.useBorderBoxSize(rootRef);

    const range = props.range;
    const minViewExtent = props.minViewExtent ?? TimelineUtils.getExtent(range) * MIN_VIEW_SHARE;

    const [rawView, setRawView] = SignalMirrorReactUtils.useOptionalState(props.view, range);

    const view = useMemo(
        () => TimelineUtils.clampView(rawView, range, minViewExtent),
        [rawView.start, rawView.end, range.start, range.end, minViewExtent],
    );

    const viewRef = useRef(view);

    const items = props.items;
    const spans = items.map((item, index) => props.computeSpan(item, index));
    const lanes =
        props.computeLane === undefined
            ? TimelineUtils.packLanes(spans)
            : items.map((item, index) => props.computeLane!(item, index));

    const laneCount = props.laneCount ?? TimelineUtils.computeLaneCount(lanes);
    const laneSize = props.laneSize;
    const laneGap = props.laneGap ?? TIMELINE_DEFAULTS.laneGap;
    const axisSize = props.axisSize ?? TIMELINE_DEFAULTS.axisSize;
    const height = TimelineUtils.computeHeight(axisSize, laneCount, laneSize, laneGap);

    const isDisabled = props.isDisabled ?? false;

    const getIsItemDisabled = (index: number) =>
        isDisabled || (props.computeIsItemDisabled?.(items[index], index) ?? false);

    const isEditable = props.onSpanChange !== undefined && !isDisabled;
    const edgeAnnouncements = props.edgeAnnouncements ?? TIMELINE_DEFAULTS.edgeAnnouncements;
    const edgeGrabSize = props.edgeGrabSize ?? TIMELINE_DEFAULTS.edgeGrabSize;
    const isPannable = (props.isPannable ?? true) && !isDisabled;
    const isZoomable = (props.isZoomable ?? true) && !isDisabled;

    const steps = TimelineUtils.chooseSteps(
        TimelineUtils.getExtent(view),
        size.width,
        props.minTickGap ?? TIMELINE_DEFAULTS.minTickGap,
        props.tickSteps,
    );

    const getPointerRatio = (clientX: number) =>
        TimelineUtils.computePointerRatio(clientX, rootRef.current?.getBoundingClientRect());

    const zone = CarrierReactUtils.useZone(
        TimelineUtils.createEdgeZone({
            getGroupId: () => timelineId,
            getLabel: () => props.ariaLabel ?? "",
            getRootRef: () => rootRef.current ?? undefined,
            getIsEditable: () => isEditable,
            getAnnouncements: () => edgeAnnouncements,
            getHeldEdge: () => heldEdgeRef.current,
            getGrabOffset: () => edgeGrabOffsetRef.current,
            getView: () => viewRef.current,
            getRange: () => range,
            getSpans: () => spans,
            getStep: () => steps.step,
            computePointerRatio: getPointerRatio,
            computeSnapValue: props.computeSnapValue,
            onSpanChange: (index, span) => props.onSpanChange?.(items[index], index, span),
        }),
    );

    const carryState = CarrierReactUtils.useCarry();
    const edgeCarry = carryState?.from === zone ? carryState.carry : undefined;
    const heldIndex = TimelineUtils.getCarriedIndex(edgeCarry);
    const shownSpans = TimelineUtils.computeShownSpans(
        spans,
        heldIndex,
        carryState?.toPlace as TimelineSpan | undefined,
    );

    const order = TimelineUtils.computeOrder(spans, lanes);
    const placements = TimelineUtils.computePlacements(shownSpans, lanes, order, view);
    const stops = TimelineUtils.computeStops(
        spans,
        lanes,
        order,
        items.map((_unused, index) => getIsItemDisabled(index)),
    );
    const rovingIndex = TimelineUtils.computeRovingIndex(stops, focusedIndex);
    const placementMap = new Map(placements.map((placement) => [placement.index, placement]));
    const renderedIndices = TimelineUtils.computeRenderedIndices(placements, rovingIndex);
    const ticks = TimelineUtils.computeTicks(view, steps);
    const markers = TimelineUtils.computeMarkers(props.markers ?? NO_MARKERS, view);

    const latest = useLatest({ range, minViewExtent, setRawView, isPannable, isZoomable, width: size.width });

    const [viewStore] = useState(() => StoreUtils.create(view, { isEqual: getIsSameSpan }));

    useLayoutEffect(() => {
        viewRef.current = view;
        viewStore.set(view);
    }, [view, viewStore]);

    const [controller] = useState<TimelineController>(() => {
        const setView = (next: TimelineSpan) => {
            const clamped = TimelineUtils.clampView(next, latest.current.range, latest.current.minViewExtent);

            if (getIsSameSpan(clamped, viewRef.current)) return false;

            viewRef.current = clamped;
            latest.current.setRawView(clamped);

            return true;
        };

        return {
            getView: () => viewStore.get(),
            zoomBy: (factor, focusRatio) =>
                setView(
                    TimelineUtils.zoomView(
                        viewRef.current,
                        factor,
                        focusRatio ?? DEFAULT_FOCUS_RATIO,
                        latest.current.range,
                        latest.current.minViewExtent,
                    ),
                ),
            panBy: (ratio) => setView(TimelineUtils.panView(viewRef.current, ratio, latest.current.range)),
            showSpan: (span) => setView(TimelineUtils.revealView(span, viewRef.current, latest.current.range)),
            subscribe: viewStore.subscribe,
        };
    });

    useEffect(() => {
        props.onMount?.(controller);
    }, [controller]);

    const [gestures] = useState(() =>
        TimelineUtils.createGestureTracker({
            getIsPannable: () => latest.current.isPannable,
            getIsZoomable: () => latest.current.isZoomable,
            getWidth: () => latest.current.width,
            computePointerRatio: (clientX) =>
                TimelineUtils.computePointerRatio(clientX, rootRef.current?.getBoundingClientRect()),
            zoomBy: (factor, focusRatio) => controller.zoomBy(factor, focusRatio),
            panBy: (ratio) => controller.panBy(ratio),
        }),
    );

    useLayoutEffect(() => {
        const element = rovingIndex === undefined ? undefined : itemRefs.current.get(rovingIndex);

        if (!isFocusFollowingRef.current || element === undefined) return;

        isFocusFollowingRef.current = false;
        element.tabIndex = ROVING_TAB_INDEX;
        element.focus();
    });

    const getEdgeCarry = () => (CarrierUtils.getSourceZone() === zone ? CarrierUtils.getCarry() : undefined);

    const setView = (next: TimelineSpan) => {
        const clamped = TimelineUtils.clampView(next, range, minViewExtent);

        if (getIsSameSpan(clamped, viewRef.current)) return;

        viewRef.current = clamped;
        setRawView(clamped);
    };

    const moveTo = (index: number) => {
        isFocusFollowingRef.current = rootRef.current?.contains(document.activeElement) ?? false;

        setFocusedIndex(index);
        setView(TimelineUtils.revealView(spans[index], viewRef.current, range));
    };

    const activateItem = (index: number) => {
        if (getIsItemDisabled(index)) return;

        setFocusedIndex(index);
        props.onItemActivate?.(items[index], index);
    };

    const focusItem = (index: number) => {
        const element = itemRefs.current.get(index);

        setFocusedIndex(index);

        if (element === undefined) return;

        element.tabIndex = ROVING_TAB_INDEX;
        element.focus();
    };

    const pickUpEdge = (index: number, edge: TimelineEdge, mode: CarryMode, from?: Point2d) => {
        if (!isEditable || getIsItemDisabled(index)) return;

        const span = spans[index];

        edgeGrabOffsetRef.current =
            from === undefined ? NOTHING : TimelineUtils.toValue(getPointerRatio(from.x), viewRef.current) - span[edge];

        setHeldEdge(edge);

        CarrierUtils.start(
            zone,
            span,
            TimelineUtils.computeEdgeCarry(timelineId, index, props.computeItemAriaLabel?.(items[index], index) ?? ""),
            mode,
        );
    };

    const revealHeldEdge = () => {
        const place = CarrierUtils.getTargetPlace() as TimelineSpan | undefined;

        if (place === undefined) return;

        const value = place[heldEdgeRef.current];

        setView(TimelineUtils.revealView({ start: value, end: value }, viewRef.current, range));
    };

    const holdEdge = (edge: TimelineEdge) => {
        const carry = getEdgeCarry();
        const place = CarrierUtils.getTargetPlace();

        if (!carry || place === undefined || edge === heldEdgeRef.current) return;

        setHeldEdge(edge);

        LiveAnnouncerUtils.announce(
            edgeAnnouncements.computeAimed(zone.computePlaceLabel(place, carry), zone.getLabel()),
        );
    };

    const handleEdgePointerDown = (index: number, edge: TimelineEdge, e: PointerEvent<HTMLDivElement>) => {
        if (!TimelineUtils.getIsPrimaryPress(e)) return;

        e.stopPropagation();

        const root = rootRef.current;

        if (!root || CarrierUtils.getCarry()) return;

        CarrierUtils.dragFromPointer(root, e.nativeEvent, (from) => pickUpEdge(index, edge, "drag", from));
    };

    const handleEdgeClick = (index: number, edge: TimelineEdge, e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (CarrierUtils.getCarry()) return;

        pickUpEdge(index, edge, "tap");
        focusItem(index);
    };

    const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
        if (!getEdgeCarry() || CarrierUtils.getCarryMode() !== "key") return;
        if (rootRef.current?.contains(e.relatedTarget as Node | null)) return;

        CarrierUtils.end("cancel");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const from = rovingIndex;

        if (from === undefined || isDisabled) return;

        const action = TimelineUtils.computeKeyAction(e.key, {
            isHolding: !!getEdgeCarry() && CarrierUtils.getCarryMode() !== "drag",
            isEditable,
        });

        if (action === undefined || action.kind === "ignore") return;

        if (action.kind === "step") {
            const next = TimelineUtils.computeStepIndex(action.step, from, stops);

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

    const isEdgeCarried = edgeCarry !== undefined;

    useEffect(() => {
        const root = rootRef.current;

        if (!root) return;

        const handleWheel = (e: WheelEvent) => gestures.wheel(e);

        root.addEventListener("wheel", handleWheel, { passive: false });

        return () => root.removeEventListener("wheel", handleWheel);
    }, [gestures]);

    useEffect(() => {
        if (!isEdgeCarried) return;

        const trackPoint = (e: globalThis.PointerEvent) => {
            if (CarrierUtils.getCarryMode() !== "tap") return;

            CarrierUtils.aimAtPoint(e.clientX, e.clientY);
        };

        document.addEventListener("pointermove", trackPoint, true);

        return () => document.removeEventListener("pointermove", trackPoint, true);
    }, [isEdgeCarried]);

    useEffect(() => {
        const root = rootRef.current;

        if (!root) return;

        const dropAtClick = (e: globalThis.MouseEvent) => {
            if (CarrierUtils.getSourceZone() !== zone || !CarrierUtils.getCarry()) return;
            if (CarrierUtils.getCarryMode() === "drag") return;

            e.preventDefault();
            e.stopPropagation();

            CarrierUtils.aimAtPoint(e.clientX, e.clientY);
            CarrierUtils.end("drop");
        };

        root.addEventListener("click", dropAtClick, true);

        return () => root.removeEventListener("click", dropAtClick, true);
    }, [zone]);

    useEffect(() => {
        if (isEditable || !isEdgeCarried) return;

        CarrierUtils.end("cancel");
    }, [isEditable, isEdgeCarried]);

    useEffect(
        () => () => {
            if (CarrierUtils.getSourceZone() === zone) CarrierUtils.end("cancel");
        },
        [zone],
    );

    const renderItem = (index: number) => {
        const placement = placementMap.get(index) ?? TimelineUtils.getBlankPlacement(index);
        const box = TimelineUtils.computeItemBox(placement, axisSize, laneSize, laneGap);
        const isItemDisabled = getIsItemDisabled(index);

        return (
            <li
                key={index}
                className={TimelineStyles.timelineItem}
                style={{
                    left: `${box.left}%`,
                    width: `${box.width}%`,
                    top: `${box.top}px`,
                    height: `${box.height}px`,
                }}
                aria-posinset={placement.order + FIRST_ARIA_POSITION}
                aria-setsize={items.length}
            >
                <InteractionWrapper<TimelineItemRenderProps>
                    sizing="fill"
                    isDisabled={isItemDisabled}
                    isTabbable={index === rovingIndex}
                    extraFlags={{
                        index,
                        placement,
                        span: shownSpans[index],
                        isFocused: focusedIndex === index,
                        heldEdge: heldIndex === index ? heldEdge : undefined,
                    }}
                    ref={(element) => {
                        if (element) itemRefs.current.set(index, element);
                        else itemRefs.current.delete(index);
                    }}
                    renderControl={(setElementRef, flags) => (
                        <TimelineItem
                            id={`${timelineId}-item-${index}`}
                            ref={setElementRef}
                            ariaLabel={props.computeItemAriaLabel?.(items[index], index)}
                            ariaDescribedBy={isEditable ? hintId : undefined}
                            flags={flags}
                            renderContent={(itemFlags) => props.renderItem(items[index], itemFlags)}
                            onActivate={() => activateItem(index)}
                            onFocused={() => setFocusedIndex(index)}
                        />
                    )}
                />

                {isEditable && !isItemDisabled && (
                    <>
                        <div
                            className={TimelineStyles.timelineEdge}
                            style={{ left: `${-edgeGrabSize * 0.5}px`, width: `${edgeGrabSize}px` }}
                            aria-hidden="true"
                            onPointerDown={(e) => handleEdgePointerDown(index, "start", e)}
                            onClick={(e) => handleEdgeClick(index, "start", e)}
                        />

                        <div
                            className={TimelineStyles.timelineEdge}
                            style={{ right: `${-edgeGrabSize * 0.5}px`, width: `${edgeGrabSize}px` }}
                            aria-hidden="true"
                            onPointerDown={(e) => handleEdgePointerDown(index, "end", e)}
                            onClick={(e) => handleEdgeClick(index, "end", e)}
                        />
                    </>
                )}
            </li>
        );
    };

    return (
        <div
            ref={rootRef}
            id={timelineId}
            className={TimelineStyles.timelineRoot}
            style={{
                height: `${height}px`,
                touchAction: isPannable || isZoomable ? "pan-y" : undefined,
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onPointerDown={(e) => gestures.press(e.nativeEvent)}
            onPointerMove={(e) => gestures.move(e.nativeEvent, e.currentTarget)}
            onPointerUp={(e) => gestures.release(e.nativeEvent, e.currentTarget)}
            onPointerCancel={(e) => gestures.release(e.nativeEvent, e.currentTarget)}
        >
            <div className={TimelineStyles.timelineTicks} aria-hidden="true">
                {ticks.map((tick, index) => (
                    <div
                        key={index}
                        className={TimelineStyles.timelineTick}
                        style={{ left: `${tick.ratio * PERCENT}%` }}
                    >
                        {props.renderTick?.(tick)}
                    </div>
                ))}
            </div>

            {isEditable && (
                <div id={hintId} className={TimelineStyles.timelineHint}>
                    {edgeAnnouncements.restingKeyHint}
                </div>
            )}

            <ul className={TimelineStyles.timelineList} role="list" aria-label={props.ariaLabel}>
                {renderedIndices.map(renderItem)}
            </ul>

            <div className={TimelineStyles.timelineMarkers} aria-hidden="true">
                {markers.map((marker, index) => (
                    <div
                        key={index}
                        className={TimelineStyles.timelineMarker}
                        style={{ left: `${marker.ratio * PERCENT}%` }}
                    >
                        {props.renderMarker?.(marker, index)}
                    </div>
                ))}
            </div>
        </div>
    );
};
