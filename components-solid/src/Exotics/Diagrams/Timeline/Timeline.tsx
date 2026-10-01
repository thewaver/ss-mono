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

import {
    CarrierUtils,
    type CarryMode,
    type CarryPlace,
    LiveAnnouncerUtils,
    TIMELINE_DEFAULTS,
    type TimelineEdge,
    type TimelineItemRenderProps,
    type TimelineSpan,
    TimelineUtils,
    TimelineStyles as styles,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { CarrierSolidUtils } from "../../../Abstracts/Carrier/CarrierSolid.utils";
import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../../Utils/propUtils";
import type { TimelineController, TimelineItemProps, TimelineProps } from "./TimelineSolid.types";

const DEFAULT_FOCUS_RATIO = 0.5;
const MIN_VIEW_SHARE = 0.001;
const PERCENT = 100;
const NOTHING = 0;
const FIRST_ARIA_POSITION = 1;
const ROVING_TAB_INDEX = 0;
const NO_MARKERS: number[] = [];

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

    let isFocusFollowing = false;
    let edgeGrabOffset = NOTHING;

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getRange = createMemo(() => access(props.range));

    const getMinViewExtent = createMemo(
        () => access(props.minViewExtent) ?? TimelineUtils.getExtent(getRange()) * MIN_VIEW_SHARE,
    );

    const viewSignal = SignalMirrorSolidUtils.createOptional(() => props.view, untrack(getRange));

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

    const getLaneCount = createMemo(() => access(props.laneCount) ?? TimelineUtils.computeLaneCount(getLanes()));

    const getLaneSize = createMemo(() => access(props.laneSize));

    const getLaneGap = createMemo(() => access(props.laneGap) ?? TIMELINE_DEFAULTS.laneGap);

    const getAxisSize = createMemo(() => access(props.axisSize) ?? TIMELINE_DEFAULTS.axisSize);

    const getHeight = createMemo(() =>
        TimelineUtils.computeHeight(getAxisSize(), getLaneCount(), getLaneSize(), getLaneGap()),
    );

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsItemDisabled = (index: number) =>
        getIsDisabled() || (props.computeIsItemDisabled?.(getItems()[index], index) ?? false);

    const getIsEditable = createMemo(() => props.onSpanChange !== undefined && !getIsDisabled());

    const getEdgeAnnouncements = createMemo(
        () => access(props.edgeAnnouncements) ?? TIMELINE_DEFAULTS.edgeAnnouncements,
    );

    const getEdgeGrabSize = createMemo(() => access(props.edgeGrabSize) ?? TIMELINE_DEFAULTS.edgeGrabSize);

    const asSpan = (place: CarryPlace) => place as TimelineSpan;

    const zone = TimelineUtils.createEdgeZone({
        getGroupId: () => timelineId,
        getLabel: () => access(props.ariaLabel) ?? "",
        getRootRef,
        getIsEditable,
        getAnnouncements: getEdgeAnnouncements,
        getHeldEdge: () => untrack(getHeldEdge),
        getGrabOffset: () => edgeGrabOffset,
        getView,
        getRange,
        getSpans,
        getStep: () => getSteps().step,
        computePointerRatio: (clientX) => getPointerRatio(clientX),
        get computeSnapValue() {
            return props.computeSnapValue;
        },
        onSpanChange: (index, span) => props.onSpanChange?.(getItems()[index], index, span),
    });

    CarrierSolidUtils.registerZone(zone);

    const getEdgeCarry = () => (CarrierSolidUtils.getSourceZone() === zone ? CarrierSolidUtils.getCarry() : undefined);

    const getHeldIndex = createMemo(() => TimelineUtils.getCarriedIndex(getEdgeCarry()));

    const getShownSpans = createMemo(() =>
        TimelineUtils.computeShownSpans(
            getSpans(),
            getHeldIndex(),
            CarrierSolidUtils.getTargetPlace() as TimelineSpan | undefined,
        ),
    );

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

    const getRovingIndex = createMemo(() => TimelineUtils.computeRovingIndex(getStops(), getFocusedIndex()));

    const getPlacementMap = createMemo(() => new Map(getPlacements().map((placement) => [placement.index, placement])));

    const getRenderedIndices = createMemo(() =>
        TimelineUtils.computeRenderedIndices(getPlacements(), getRovingIndex()),
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

    const getPlacementOf = (index: number) => getPlacementMap().get(index) ?? TimelineUtils.getBlankPlacement(index);

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

    const getPointerRatio = (clientX: number) =>
        TimelineUtils.computePointerRatio(clientX, getRootRef()?.getBoundingClientRect());

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
            TimelineUtils.computeEdgeCarry(
                timelineId,
                index,
                props.computeItemAriaLabel?.(getItems()[index], index) ?? "",
            ),
            mode,
        );
    };

    const revealHeldEdge = () => {
        const place = CarrierSolidUtils.getTargetPlace();

        if (place === undefined) return;

        const value = asSpan(place)[untrack(getHeldEdge)];

        setView(TimelineUtils.revealView({ start: value, end: value }, getView(), getRange()));
    };

    const holdEdge = (edge: TimelineEdge) => {
        const carry = getEdgeCarry();
        const place = CarrierSolidUtils.getTargetPlace();

        if (!carry || place === undefined || edge === untrack(getHeldEdge)) return;

        setHeldEdge(edge);

        LiveAnnouncerUtils.announce(
            getEdgeAnnouncements().computeAimed(zone.computePlaceLabel(place, carry), zone.getLabel()),
        );
    };

    const handleEdgePointerDown = (index: number, edge: TimelineEdge, e: PointerEvent) => {
        if (!TimelineUtils.getIsPrimaryPress(e)) return;

        e.stopPropagation();

        const root = getRootRef();

        if (!root || CarrierSolidUtils.getCarry()) return;

        CarrierSolidUtils.dragFromPointer(root, e, (from) => pickUpEdge(index, edge, "drag", from));
    };

    const handleEdgeClick = (index: number, edge: TimelineEdge, e: MouseEvent) => {
        e.stopPropagation();

        if (CarrierSolidUtils.getCarry()) return;

        pickUpEdge(index, edge, "tap");
        focusItem(index);
    };

    const handleFocusOut = (e: FocusEvent) => {
        if (!getEdgeCarry() || CarrierSolidUtils.getCarryMode() !== "key") return;
        if (getRootRef()?.contains(e.relatedTarget as Node | null)) return;

        CarrierSolidUtils.end("cancel");
    };

    const gestures = TimelineUtils.createGestureTracker({
        getIsPannable: () => getIsPannable(),
        getIsZoomable: () => getIsZoomable(),
        getWidth,
        computePointerRatio: getPointerRatio,
        zoomBy: (factor, focusRatio) => controller.zoomBy(factor, focusRatio),
        panBy: (ratio) => controller.panBy(ratio),
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const from = getRovingIndex();

        if (from === undefined || getIsDisabled()) return;

        const action = TimelineUtils.computeKeyAction(e.key, {
            isHolding: !!getEdgeCarry() && CarrierSolidUtils.getCarryMode() !== "drag",
            isEditable: getIsEditable(),
        });

        if (action === undefined || action.kind === "ignore") return;

        if (action.kind === "step") {
            const next = TimelineUtils.computeStepIndex(action.step, from, getStops());

            if (next === undefined) return;

            e.preventDefault();
            moveTo(next);

            return;
        }

        e.preventDefault();

        if (action.kind === "cancel") CarrierSolidUtils.end("cancel");
        if (action.kind === "drop") CarrierSolidUtils.end("drop");
        if (action.kind === "hold") pickUpEdge(from, "end", "key");
        if (action.kind === "activate") activateItem(from);

        if (action.kind !== "aim") return;

        if (action.edge !== undefined) holdEdge(action.edge);
        if (action.nudge !== undefined) CarrierUtils.aimAtNudge({ x: action.nudge });

        revealHeldEdge();
    };

    createEffect(() => {
        if (!getEdgeCarry()) return;

        const trackPoint = (e: PointerEvent) => {
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

        const dropAtClick = (e: MouseEvent) => {
            if (!getEdgeCarry() || CarrierSolidUtils.getCarryMode() === "drag") return;

            e.preventDefault();
            e.stopPropagation();

            CarrierUtils.aimAtPoint(e.clientX, e.clientY);
            CarrierSolidUtils.end("drop");
        };

        root.addEventListener("click", dropAtClick, true);

        onCleanup(() => {
            root.removeEventListener("click", dropAtClick, true);
        });
    });

    createEffect(() => {
        if (getIsEditable() || !getEdgeCarry()) return;

        CarrierSolidUtils.end("cancel");
    });

    onCleanup(() => {
        if (CarrierSolidUtils.getSourceZone() === zone) CarrierSolidUtils.end("cancel");
    });

    const renderItem = (index: number) => {
        const getPlacement = () => getPlacementOf(index);
        const getBox = () => TimelineUtils.computeItemBox(getPlacement(), getAxisSize(), getLaneSize(), getLaneGap());

        return (
            <li
                class={styles.timelineItem}
                style={{
                    left: `${getBox().left}%`,
                    width: `${getBox().width}%`,
                    top: `${getBox().top}px`,
                    height: `${getBox().height}px`,
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
            onPointerDown={(e) => gestures.press(e)}
            onPointerMove={(e) => gestures.move(e, e.currentTarget)}
            onPointerUp={(e) => gestures.release(e, e.currentTarget)}
            onPointerCancel={(e) => gestures.release(e, e.currentTarget)}
            onWheel={(e) => gestures.wheel(e)}
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
