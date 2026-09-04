import {
    For,
    Index,
    batch,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    onCleanup,
    onMount,
    untrack,
} from "solid-js";

import { ElementObserver } from "../../Abstracts/ElementObserver/ElementObserver";
import { SignalMirror } from "../../Abstracts/SignalMirror/SignalMirror";
import { InteractionWrapper } from "../../Fundamentals/InteractionWrapper/InteractionWrapper";
import { access } from "../../Utils/propUtils";
import type {
    TimelineController,
    TimelineItemProps,
    TimelineItemRenderProps,
    TimelinePlacement,
    TimelineProps,
    TimelineSpan,
    TimelineStep,
} from "./Timeline.types";
import { TimelineUtils } from "./Timeline.utils";

import * as styles from "./Timeline.css";

const DEFAULT_LANE_GAP = 4;
const DEFAULT_AXIS_SIZE = 0;
const DEFAULT_MIN_TICK_GAP = 64;
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

const ACTIVATION_KEYS = ["Enter", " "];

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
            aria-posinset={props.posInSet}
            aria-setsize={props.setSize}
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
    const timelineId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getItemRefs, setItemRefs] = createSignal<Record<number, HTMLElement | undefined>>({});
    const [getFocusedIndex, setFocusedIndex] = createSignal<number>();

    const pointerXs = new Map<number, number>();

    let isFocusFollowing = false;
    let isGrabbing = false;
    let panFrom: number | undefined;
    let pinchGap: number | undefined;
    let pinchCentre: number | undefined;

    const getSize = ElementObserver.createBorderBoxSizeObserver(getRootRef);

    const getRange = createMemo(() => access(props.range));

    const getMinViewExtent = createMemo(
        () => access(props.minViewExtent) ?? TimelineUtils.getExtent(getRange()) * MIN_VIEW_SHARE,
    );

    const viewSignal = SignalMirror.createOptional(() => props.viewSignal, untrack(getRange));

    const getView = createMemo(() => TimelineUtils.clampView(viewSignal[0](), getRange(), getMinViewExtent()));

    const setView = (view: TimelineSpan) => {
        viewSignal[1](() => TimelineUtils.clampView(view, getRange(), getMinViewExtent()));
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

    const getLaneGap = createMemo(() => access(props.laneGap) ?? DEFAULT_LANE_GAP);

    const getAxisSize = createMemo(() => access(props.axisSize) ?? DEFAULT_AXIS_SIZE);

    const getHeight = createMemo(() => getAxisSize() + getLaneCount() * (getLaneSize() + getLaneGap()) - getLaneGap());

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsItemDisabled = (index: number) =>
        getIsDisabled() || (props.computeIsItemDisabled?.(getItems()[index], index) ?? false);

    const getOrder = createMemo(() => TimelineUtils.computeOrder(getSpans(), getLanes()));

    const getPlacements = createMemo(() =>
        TimelineUtils.computePlacements(getSpans(), getLanes(), getOrder(), getView()),
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
            access(props.minTickGap) ?? DEFAULT_MIN_TICK_GAP,
            access(props.tickSteps),
        ),
    );

    const getTicks = createMemo(() => TimelineUtils.computeTicks(getView(), getSteps()));

    const setItemRef = (index: number, element: HTMLElement) => {
        setItemRefs((previous) => ({ ...previous, [index]: element }));

        onCleanup(() => {
            setItemRefs((previous) => ({ ...previous, [index]: undefined }));
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
        const element = index === undefined ? undefined : getItemRefs()[index];

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
        const centre = (first + second) / PINCH_POINTERS;

        if (pinchGap !== undefined && gap > NOTHING && pinchCentre !== undefined) {
            const ratio = getPointerRatio(centre);

            if (getIsZoomable()) controller.zoomBy(pinchGap / gap, ratio);
            if (getIsPannable() && getWidth() > NOTHING) {
                controller.panBy((pinchCentre - centre) / getWidth());
            }
        }

        pinchGap = gap;
        pinchCentre = centre;
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!pointerXs.has(e.pointerId)) return;

        pointerXs.set(e.pointerId, e.clientX);

        if (pointerXs.size >= PINCH_POINTERS) {
            handlePinch();

            return;
        }

        if (panFrom === undefined || !getIsPannable()) return;

        const travelled = e.clientX - panFrom;

        if (!isGrabbing && Math.abs(travelled) < DRAG_SLOP) return;

        if (!isGrabbing) {
            isGrabbing = true;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }

        if (getWidth() > NOTHING) controller.panBy(-travelled / getWidth());

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

        if (ACTIVATION_KEYS.includes(e.key)) {
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
            >
                <InteractionWrapper
                    sizing={"fill"}
                    isDisabled={() => getIsItemDisabled(index)}
                    isTabbable={() => index === getRovingIndex()}
                    extraFlags={(): TimelineItemRenderProps => ({
                        index,
                        placement: getPlacement(),
                        span: getSpans()[index],
                        isFocused: getFocusedIndex() === index,
                    })}
                    ref={(element) => setItemRef(index, element)}
                    renderControl={(setElementRef, getFlags) => (
                        <TimelineItem
                            id={`${timelineId}-item-${index}`}
                            ref={setElementRef}
                            ariaLabel={props.computeItemAriaLabel?.(getItems()[index], index)}
                            posInSet={getPlacement().order + FIRST_ARIA_POSITION}
                            setSize={getItems().length}
                            flags={getFlags()}
                            renderContent={(getItemFlags) => props.renderItem(() => getItems()[index], getItemFlags)}
                            onActivate={() => activateItem(index)}
                            onFocused={() => setFocusedIndex(index)}
                        />
                    )}
                />
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
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endGesture}
            onPointerCancel={endGesture}
            onWheel={handleWheel}
        >
            <div class={styles.timelineTicks} aria-hidden={"true"}>
                <Index each={getTicks()}>
                    {(getTick) => (
                        <div class={styles.timelineTick} style={{ left: `${getTick().ratio * PERCENT}%` }}>
                            {props.renderTick?.(getTick)}
                        </div>
                    )}
                </Index>
            </div>

            <ul class={styles.timelineList} aria-label={access(props.ariaLabel)}>
                <For each={getRenderedIndices()}>{(index) => renderItem(index)}</For>
            </ul>
        </div>
    );
};
