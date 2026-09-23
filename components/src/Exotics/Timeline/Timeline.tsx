import {
    For,
    Index,
    Show,
    batch,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    onCleanup,
    onMount,
    untrack,
} from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import type { CarrierZone, Carry, CarryMode, CarryPlace } from "../../Abstracts/Carrier/Carrier.types";
import { CarrierUtils } from "../../Abstracts/Carrier/Carrier.utils";
import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import { LiveAnnouncerUtils } from "../../Abstracts/LiveAnnouncer/LiveAnnouncer.utils";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../Utils/propUtils";
import { TIMELINE_DEFAULTS } from "./Timeline.const";
import type {
    TimelineController,
    TimelineEdge,
    TimelineEdgeCarry,
    TimelineItemProps,
    TimelineItemRenderProps,
    TimelinePlacement,
    TimelineProps,
    TimelineSpan,
    TimelineStep,
} from "./Timeline.types";
import { TimelineUtils } from "./Timeline.utils";

import * as styles from "./Timeline.css";

const DEFAULT_FOCUS_RATIO = 0.5;
const MIN_VIEW_SHARE = 0.001;
const PERCENT = 100;
const NOTHING = 0;
const SINGLE = 1;
const FIRST_ARIA_POSITION = 1;
const ROVING_TAB_INDEX = 0;
const PRIMARY_BUTTON = 0;
const PINCH_POINTERS = 2;
const DRAG_SLOP = 4;
const ZOOM_RATE = 0.0015;
const HOLD_KEY = "Enter";
const NO_MARKERS: number[] = [];

const EDGE_BY_KEY: Record<string, TimelineEdge> = {
    Home: "start",
    End: "end",
};

const NUDGE_BY_KEY: Record<string, number> = {
    ArrowRight: SINGLE,
    ArrowLeft: -SINGLE,
};

const STEP_BY_KEY: Record<string, TimelineStep> = {
    ArrowRight: "next",
    ArrowLeft: "previous",
    ArrowDown: "laneAfter",
    ArrowUp: "laneBefore",
    Home: "first",
    End: "last",
};

const TimelineItem = (props: TimelineItemProps) => {
    const getIsDisabled = () => props.flags.isDisabled ?? false;

    return (
        <div
            id={props.id}
            ref={props.ref}
            class={styles.timelineControl}
            role="button"
            aria-label={props.ariaLabel}
            aria-describedby={props.ariaDescribedBy}
            aria-disabled={getIsDisabled() || undefined}
            onFocus={() => props.onFocused()}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onActivate();
            }}
        >
            {props.renderContent(() => props.flags)}
        </div>
    );
};

export const Timeline = <T,>(props: TimelineProps<T>) => {
    onMount(() => LiveAnnouncerUtils.reserve("polite"));

    const timelineId = createUniqueId();
    const hintId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const itemRefs = new Map<number, HTMLElement>();
    const [getFocusedIndex, setFocusedIndex] = createSignal<number>();
    const [getHeldEdge, setHeldEdge] = createSignal<TimelineEdge>("end");

    const pointerXs = new Map<number, number>();

    let isFocusFollowing = false;
    let isGrabbing = false;
    let panFrom: number | undefined;
    let pinchGap: number | undefined;
    let pinchCenter: number | undefined;
    let edgeGrabOffset = NOTHING;

    const getSize = ElementObserverUtils.createBorderBoxSizeObserver(getRootRef);

    const getRange = createMemo(() => access(props.range));

    const getMinViewExtent = createMemo(
        () => access(props.minViewExtent) ?? TimelineUtils.getExtent(getRange()) * MIN_VIEW_SHARE,
    );

    const viewSignal = SignalMirrorUtils.createOptional(() => props.viewSignal, untrack(getRange));

    const getView = createMemo(() => TimelineUtils.clampView(viewSignal[0](), getRange(), getMinViewExtent()));

    const setView = (view: TimelineSpan) => {
        const next = TimelineUtils.clampView(view, getRange(), getMinViewExtent());
        const current = untrack(getView);

        if (next.start === current.start && next.end === current.end) return false;

        viewSignal[1](() => next);

        return true;
    };

    const getItems = createMemo(() => access(props.items));

    const getSpans = createMemo(() => getItems().map((item, index) => props.computeSpan(item, index)));

    const getLanes = createMemo(() =>
        props.computeLane === undefined
            ? TimelineUtils.packLanes(getSpans())
            : getItems().map((item, index) => props.computeLane!(item, index)),
    );

    const getLaneCount = createMemo(
        () => access(props.laneCount) ?? getLanes().reduce((most, lane) => Math.max(most, lane + SINGLE), SINGLE),
    );

    const getLaneSize = createMemo(() => access(props.laneSize));

    const getLaneGap = createMemo(() => access(props.laneGap) ?? TIMELINE_DEFAULTS.laneGap);

    const getAxisSize = createMemo(() => access(props.axisSize) ?? TIMELINE_DEFAULTS.axisSize);

    const getHeight = createMemo(() => getAxisSize() + getLaneCount() * (getLaneSize() + getLaneGap()) - getLaneGap());

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsItemDisabled = (index: number) =>
        getIsDisabled() || (props.computeIsItemDisabled?.(getItems()[index], index) ?? false);

    const getIsEditable = createMemo(() => props.onSpanChange !== undefined && !getIsDisabled());

    const getEdgeAnnouncements = createMemo(
        () => access(props.edgeAnnouncements) ?? TIMELINE_DEFAULTS.edgeAnnouncements,
    );

    const getEdgeGrabSize = createMemo(() => access(props.edgeGrabSize) ?? TIMELINE_DEFAULTS.edgeGrabSize);

    const asEdgeCarry = (carry: Carry) => carry.value as TimelineEdgeCarry;

    const asSpan = (place: CarryPlace) => place as TimelineSpan;

    const zone: CarrierZone = {
        getGroupId: () => timelineId,
        getLabel: () => access(props.ariaLabel) ?? "",
        getRootRef,
        getIsDisabled: () => !getIsEditable(),
        getKeyHint: () => getEdgeAnnouncements().heldKeyHint,
        getAnnouncements: getEdgeAnnouncements,
        computeCanAccept: () => getIsEditable(),
        computePlaceAtPoint: (point) => {
            const place = CarrierUtils.getTargetPlace();

            if (place === undefined) return undefined;

            const value = TimelineUtils.toValue(getPointerRatio(point.x), getView()) - edgeGrabOffset;
            const snapped = props.computeSnapValue?.(value) ?? value;

            return TimelineUtils.moveEdge(asSpan(place), untrack(getHeldEdge), snapped, getRange());
        },
        computeNudgedPlace: (place, nudge) => {
            const span = asSpan(place);
            const edge = untrack(getHeldEdge);
            const value = TimelineUtils.computeSteppedEdgeValue(
                span[edge],
                nudge.x ?? NOTHING,
                getSteps().step,
                getRange(),
                props.computeSnapValue,
            );

            return TimelineUtils.moveEdge(span, edge, value, getRange());
        },
        computeEntryPlace: (carry) => getSpans()[asEdgeCarry(carry).index],
        computeIsSamePlace: (first, second) =>
            asSpan(first).start === asSpan(second).start && asSpan(first).end === asSpan(second).end,
        computeIsPlaceAllowed: () => true,
        computePlaceLabel: (place) => getEdgeAnnouncements().computePlaceLabel(untrack(getHeldEdge), asSpan(place)),
        takeAt: () => undefined,
        putAt: () => undefined,
        moveAt: (_unusedFrom, toPlace, carry) => {
            const index = asEdgeCarry(carry).index;

            props.onSpanChange?.(getItems()[index], index, asSpan(toPlace));
        },
    };

    CarrierUtils.registerZone(zone);

    const getEdgeCarry = () => (CarrierUtils.getSourceZone() === zone ? CarrierUtils.getCarry() : undefined);

    const getHeldIndex = createMemo(() => {
        const carry = getEdgeCarry();

        return carry && asEdgeCarry(carry).index;
    });

    const getShownSpans = createMemo(() => {
        const index = getHeldIndex();
        const place = CarrierUtils.getTargetPlace();

        if (index === undefined || place === undefined) return getSpans();

        return getSpans().map((span, at) => (at === index ? asSpan(place) : span));
    });

    const getOrder = createMemo(() => TimelineUtils.computeOrder(getSpans(), getLanes()));

    const getPlacements = createMemo(() =>
        TimelineUtils.computePlacements(getShownSpans(), getLanes(), getOrder(), getView()),
    );

    const getStops = createMemo(() =>
        TimelineUtils.computeStops(
            getSpans(),
            getLanes(),
            getOrder(),
            getItems().map((_unused, index) => getIsItemDisabled(index)),
        ),
    );

    const getRovingIndex = createMemo(() => {
        const stops = getStops();
        const focused = getFocusedIndex();

        if (focused !== undefined && stops.some((stop) => stop.index === focused)) return focused;

        return stops[NOTHING]?.index;
    });

    const getPlacementMap = createMemo(() => new Map(getPlacements().map((placement) => [placement.index, placement])));

    const getRenderedIndices = createMemo(() =>
        getPlacements()
            .filter((placement) => placement.isInView || placement.index === getRovingIndex())
            .map((placement) => placement.index),
    );

    const getSteps = createMemo(() =>
        TimelineUtils.chooseSteps(
            TimelineUtils.getExtent(getView()),
            getSize().width,
            access(props.minTickGap) ?? TIMELINE_DEFAULTS.minTickGap,
            access(props.tickSteps),
        ),
    );

    const getTicks = createMemo(() => TimelineUtils.computeTicks(getView(), getSteps()));

    const getMarkers = createMemo(() => TimelineUtils.computeMarkers(access(props.markers) ?? NO_MARKERS, getView()));

    const setItemRef = (index: number, element: HTMLElement) => {
        itemRefs.set(index, element);

        onCleanup(() => {
            if (itemRefs.get(index) === element) itemRefs.delete(index);
        });
    };

    const getPlacementOf = (index: number): TimelinePlacement =>
        getPlacementMap().get(index) ?? {
            index,
            order: NOTHING,
            lane: NOTHING,
            startRatio: NOTHING,
            endRatio: NOTHING,
            isInView: false,
        };

    const controller: TimelineController = {
        getView,
        zoomBy: (factor, focusRatio) =>
            setView(
                TimelineUtils.zoomView(
                    getView(),
                    factor,
                    focusRatio ?? DEFAULT_FOCUS_RATIO,
                    getRange(),
                    getMinViewExtent(),
                ),
            ),
        panBy: (ratio) => setView(TimelineUtils.panView(getView(), ratio, getRange())),
        showSpan: (span) => setView(TimelineUtils.revealView(span, getView(), getRange())),
    };

    onMount(() => {
        props.onMount?.(controller);
    });

    createEffect(() => {
        const index = getRovingIndex();
        const element = index === undefined ? undefined : itemRefs.get(index);

        if (!isFocusFollowing || element === undefined) return;

        isFocusFollowing = false;
        element.tabIndex = ROVING_TAB_INDEX;
        element.focus();
    });

    const moveTo = (index: number) => {
        isFocusFollowing = getRootRef()?.contains(document.activeElement) ?? false;

        batch(() => {
            setFocusedIndex(index);
            setView(TimelineUtils.revealView(getSpans()[index], getView(), getRange()));
        });
    };

    const activateItem = (index: number) => {
        if (getIsItemDisabled(index)) return;

        setFocusedIndex(index);
        props.onItemActivate?.(getItems()[index], index);
    };

    const getIsPannable = createMemo(() => (access(props.isPannable) ?? true) && !getIsDisabled());

    const getIsZoomable = createMemo(() => (access(props.isZoomable) ?? true) && !getIsDisabled());

    const getPointerRatio = (clientX: number) => {
        const rect = getRootRef()?.getBoundingClientRect();

        if (rect === undefined || rect.width === NOTHING) return DEFAULT_FOCUS_RATIO;

        return (clientX - rect.left) / rect.width;
    };

    const getWidth = () => getSize().width;

    const focusItem = (index: number) => {
        const element = itemRefs.get(index);

        setFocusedIndex(index);

        if (element === undefined) return;

        element.tabIndex = ROVING_TAB_INDEX;
        element.focus();
    };

    const pickUpEdge = (index: number, edge: TimelineEdge, mode: CarryMode, from?: Point2d) => {
        if (!getIsEditable() || getIsItemDisabled(index)) return;

        const span = getSpans()[index];

        edgeGrabOffset =
            from === undefined ? NOTHING : TimelineUtils.toValue(getPointerRatio(from.x), getView()) - span[edge];

        setHeldEdge(edge);

        CarrierUtils.start(
            zone,
            span,
            {
                groupId: timelineId,
                key: `${index}`,
                label: props.computeItemAriaLabel?.(getItems()[index], index) ?? "",
                value: { index } satisfies TimelineEdgeCarry,
            },
            mode,
        );
    };

    const revealHeldEdge = () => {
        const place = CarrierUtils.getTargetPlace();

        if (place === undefined) return;

        const value = asSpan(place)[untrack(getHeldEdge)];

        setView(TimelineUtils.revealView({ start: value, end: value }, getView(), getRange()));
    };

    const holdEdge = (edge: TimelineEdge) => {
        const carry = getEdgeCarry();
        const place = CarrierUtils.getTargetPlace();

        if (!carry || place === undefined || edge === untrack(getHeldEdge)) return;

        setHeldEdge(edge);

        LiveAnnouncerUtils.announce(
            getEdgeAnnouncements().computeAimed(zone.computePlaceLabel(place, carry), zone.getLabel()),
        );
    };

    const handleEdgePointerDown = (index: number, edge: TimelineEdge, e: PointerEvent) => {
        if (e.button !== PRIMARY_BUTTON && e.pointerType === "mouse") return;

        e.stopPropagation();

        const root = getRootRef();

        if (!root || CarrierUtils.getCarry()) return;

        CarrierUtils.dragFromPointer(root, e, (from) => pickUpEdge(index, edge, "drag", from));
    };

    const handleEdgeClick = (index: number, edge: TimelineEdge, e: MouseEvent) => {
        e.stopPropagation();

        if (CarrierUtils.getCarry()) return;

        pickUpEdge(index, edge, "tap");
        focusItem(index);
    };

    const handleFocusOut = (e: FocusEvent) => {
        if (!getEdgeCarry() || CarrierUtils.getCarryMode() !== "key") return;
        if (getRootRef()?.contains(e.relatedTarget as Node | null)) return;

        CarrierUtils.end("cancel");
    };

    const handleHeldKeyDown = (e: KeyboardEvent) => {
        if (!getEdgeCarry() || CarrierUtils.getCarryMode() === "drag") return false;

        const edge = EDGE_BY_KEY[e.key];
        const nudge = NUDGE_BY_KEY[e.key];

        if (e.key === "Escape") {
            e.preventDefault();
            CarrierUtils.end("cancel");

            return true;
        }

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            CarrierUtils.end("drop");

            return true;
        }

        if (edge === undefined && nudge === undefined) return STEP_BY_KEY[e.key] !== undefined;

        e.preventDefault();

        if (edge !== undefined) holdEdge(edge);
        if (nudge !== undefined) CarrierUtils.aimAtNudge({ x: nudge });

        revealHeldEdge();

        return true;
    };

    const endGesture = (e: PointerEvent) => {
        pointerXs.delete(e.pointerId);
        pinchGap = undefined;

        if (pointerXs.size < PINCH_POINTERS) panFrom = pointerXs.values().next().value;

        if (isGrabbing && pointerXs.size === NOTHING) {
            isGrabbing = false;
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        }
    };

    const handlePointerDown = (e: PointerEvent) => {
        if (e.button !== PRIMARY_BUTTON && e.pointerType === "mouse") return;
        if (!getIsPannable() && !getIsZoomable()) return;

        pointerXs.set(e.pointerId, e.clientX);
        panFrom = pointerXs.size === SINGLE ? e.clientX : undefined;
        pinchGap = undefined;
    };

    const handlePinch = () => {
        const [first, second] = [...pointerXs.values()];
        const gap = Math.abs(second - first);
        const center = (first + second) / PINCH_POINTERS;

        if (pinchGap !== undefined && gap > NOTHING && pinchCenter !== undefined) {
            const ratio = getPointerRatio(center);

            if (getIsZoomable()) controller.zoomBy(pinchGap / gap, ratio);
            if (getIsPannable() && getWidth() > NOTHING) {
                controller.panBy((pinchCenter - center) / getWidth());
            }
        }

        pinchGap = gap;
        pinchCenter = center;
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!pointerXs.has(e.pointerId)) return;

        pointerXs.set(e.pointerId, e.clientX);

        if (pointerXs.size >= PINCH_POINTERS) {
            handlePinch();

            return;
        }

        if (panFrom === undefined || !getIsPannable()) return;

        const traveled = e.clientX - panFrom;

        if (!isGrabbing && Math.abs(traveled) < DRAG_SLOP) return;

        if (!isGrabbing) {
            isGrabbing = true;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }

        if (getWidth() > NOTHING) controller.panBy(-traveled / getWidth());

        panFrom = e.clientX;
    };

    const handleWheel = (e: WheelEvent) => {
        if (!getIsZoomable()) return;

        e.preventDefault();
        controller.zoomBy(Math.exp(e.deltaY * ZOOM_RATE), getPointerRatio(e.clientX));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const from = getRovingIndex();

        if (from === undefined || getIsDisabled()) return;

        if (handleHeldKeyDown(e)) return;

        if (e.key === HOLD_KEY && getIsEditable()) {
            e.preventDefault();
            pickUpEdge(from, "end", "key");

            return;
        }

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            activateItem(from);

            return;
        }

        const step = STEP_BY_KEY[e.key];

        if (step === undefined) return;

        const next = TimelineUtils.computeStepIndex(step, from, getStops());

        if (next === undefined) return;

        e.preventDefault();
        moveTo(next);
    };

    createEffect(() => {
        if (!getEdgeCarry()) return;

        const trackPoint = (e: PointerEvent) => {
            if (CarrierUtils.getCarryMode() !== "tap") return;

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

        const dropAtClick = (e: MouseEvent) => {
            if (!getEdgeCarry() || CarrierUtils.getCarryMode() === "drag") return;

            e.preventDefault();
            e.stopPropagation();

            CarrierUtils.aimAtPoint(e.clientX, e.clientY);
            CarrierUtils.end("drop");
        };

        root.addEventListener("click", dropAtClick, true);

        onCleanup(() => {
            root.removeEventListener("click", dropAtClick, true);
        });
    });

    createEffect(() => {
        if (getIsEditable() || !getEdgeCarry()) return;

        CarrierUtils.end("cancel");
    });

    onCleanup(() => {
        if (CarrierUtils.getSourceZone() === zone) CarrierUtils.end("cancel");
    });

    const renderItem = (index: number) => {
        const getPlacement = () => getPlacementOf(index);

        return (
            <li
                class={styles.timelineItem}
                style={{
                    left: `${getPlacement().startRatio * PERCENT}%`,
                    width: `${(getPlacement().endRatio - getPlacement().startRatio) * PERCENT}%`,
                    top: `${getAxisSize() + getPlacement().lane * (getLaneSize() + getLaneGap())}px`,
                    height: `${getLaneSize()}px`,
                }}
                aria-posinset={getPlacement().order + FIRST_ARIA_POSITION}
                aria-setsize={getItems().length}
            >
                <InteractionWrapper
                    sizing={"fill"}
                    isDisabled={() => getIsItemDisabled(index)}
                    isTabbable={() => index === getRovingIndex()}
                    extraFlags={(): TimelineItemRenderProps => ({
                        index,
                        placement: getPlacement(),
                        span: getShownSpans()[index],
                        isFocused: getFocusedIndex() === index,
                        heldEdge: getHeldIndex() === index ? getHeldEdge() : undefined,
                    })}
                    ref={(element) => setItemRef(index, element)}
                    renderControl={(setElementRef, getFlags) => (
                        <TimelineItem
                            id={`${timelineId}-item-${index}`}
                            ref={setElementRef}
                            ariaLabel={props.computeItemAriaLabel?.(getItems()[index], index)}
                            ariaDescribedBy={getIsEditable() ? hintId : undefined}

                            flags={getFlags()}
                            renderContent={(getItemFlags) => props.renderItem(() => getItems()[index], getItemFlags)}
                            onActivate={() => activateItem(index)}
                            onFocused={() => setFocusedIndex(index)}
                        />
                    )}
                />

                <Show when={getIsEditable() && !getIsItemDisabled(index)}>
                    <div
                        class={styles.timelineEdge}
                        style={{ left: `${-getEdgeGrabSize() * 0.5}px`, width: `${getEdgeGrabSize()}px` }}
                        aria-hidden="true"
                        onPointerDown={(e) => handleEdgePointerDown(index, "start", e)}
                        onClick={(e) => handleEdgeClick(index, "start", e)}
                    />

                    <div
                        class={styles.timelineEdge}
                        style={{ right: `${-getEdgeGrabSize() * 0.5}px`, width: `${getEdgeGrabSize()}px` }}
                        aria-hidden="true"
                        onPointerDown={(e) => handleEdgePointerDown(index, "end", e)}
                        onClick={(e) => handleEdgeClick(index, "end", e)}
                    />
                </Show>
            </li>
        );
    };

    return (
        <div
            ref={setRootRef}
            id={timelineId}
            class={styles.timelineRoot}
            style={{
                "height": `${getHeight()}px`,
                "touch-action": getIsPannable() || getIsZoomable() ? "pan-y" : undefined,
            }}
            onKeyDown={handleKeyDown}
            onFocusOut={handleFocusOut}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endGesture}
            onPointerCancel={endGesture}
            onWheel={handleWheel}
        >
            <div class={styles.timelineTicks} aria-hidden="true">
                <Index each={getTicks()}>
                    {(getTick) => (
                        <div class={styles.timelineTick} style={{ left: `${getTick().ratio * PERCENT}%` }}>
                            {props.renderTick?.(getTick)}
                        </div>
                    )}
                </Index>
            </div>

            <Show when={getIsEditable()}>
                <div id={hintId} class={styles.timelineHint}>
                    {getEdgeAnnouncements().restingKeyHint}
                </div>
            </Show>

            <ul class={styles.timelineList} role="list" aria-label={access(props.ariaLabel)}>
                <For each={getRenderedIndices()}>{(index) => renderItem(index)}</For>
            </ul>

            <div class={styles.timelineMarkers} aria-hidden="true">
                <Index each={getMarkers()}>
                    {(getMarker, index) => (
                        <div class={styles.timelineMarker} style={{ left: `${getMarker().ratio * PERCENT}%` }}>
                            {props.renderMarker?.(getMarker, index)}
                        </div>
                    )}
                </Index>
            </div>
        </div>
    );
};
