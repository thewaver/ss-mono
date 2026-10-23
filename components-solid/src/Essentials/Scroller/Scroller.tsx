import {
    Index,
    type ParentProps,
    Show,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    onCleanup,
    untrack,
} from "solid-js";

import {
    FocusManagerUtils,
    SCROLLER_AXES,
    SCROLLER_DEFAULTS,
    type ScrollerAxis,
    type ScrollerBarRefs,
    type ScrollerBarRenderProps,
    type ScrollerStepper,
    ScrollerUtils,
    ScrollerStyles as styles,
} from "@thewaver/ss-components";
import { FunctionUtils } from "@thewaver/ss-utils";

import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../Utils/propUtils";
import type { ScrollerBarProps, ScrollerProps } from "./ScrollerSolid.types";

const ARIA_VALUE_MAX = 100;
const ARIA_VALUE_THROTTLE_MS = 100;

const ARIA_ORIENTATIONS: Record<ScrollerAxis, "horizontal" | "vertical"> = { x: "horizontal", y: "vertical" };

const STEP_AREAS: Record<ScrollerAxis, Record<"leading" | "trailing", string>> = {
    x: { leading: ScrollerUtils.AREAS.xLeading, trailing: ScrollerUtils.AREAS.xTrailing },
    y: { leading: ScrollerUtils.AREAS.yLeading, trailing: ScrollerUtils.AREAS.yTrailing },
};

const ScrollerBar = (props: ScrollerBarProps) => {
    const [getTrackRef, setTrackRef] = createSignal<HTMLElement>();
    const [getThumbRef, setThumbRef] = createSignal<HTMLElement>();
    const [getTrackLength, setTrackLength] = createSignal(0);
    const [getIsDragging, setIsDragging] = createSignal(false);
    const [getAriaValue, setAriaValue] = createSignal(0);

    const getAxis = () => access(props.axis);

    const bar = ScrollerUtils.createBar({
        axis: untrack(getAxis),
        getBox: () => access(props.boxRef),
        getTrack: getTrackRef,
        getThumb: getThumbRef,
        getOverlapCount: () => access(props.overlapCount),
        getComputeProgressAtPoint: () => props.computeProgressAtPoint,
        onDraggingChange: setIsDragging,
    });

    onCleanup(bar.stop);

    const refs: ScrollerBarRefs = { setTrackRef, setThumbRef };

    createEffect(() => {
        const track = getTrackRef();
        const axis = getAxis();

        if (!track) return;

        onCleanup(ScrollerUtils.observeTrackLength(track, axis, setTrackLength));
    });

    createEffect(() => {
        const root = access(props.rootRef);

        if (!root) return;

        root.addEventListener("click", bar.swallowClick, true);

        onCleanup(() => root.removeEventListener("click", bar.swallowClick, true));
    });

    const getRatio = createMemo(() => ScrollerUtils.computeProgressRatio(access(props.metrics)));

    const getThumbLength = createMemo(() => ScrollerUtils.computeThumbLength(access(props.metrics), getTrackLength()));

    const reportAriaValue = FunctionUtils.trailingThrottle(
        (ratio: number) => setAriaValue(Math.round(ratio * ARIA_VALUE_MAX)),
        ARIA_VALUE_THROTTLE_MS,
    );

    onCleanup(reportAriaValue.cancel);

    createEffect(() => reportAriaValue(getRatio()));

    const getRenderProps = createMemo((): ScrollerBarRenderProps => {
        const isAutoHiding = access(props.isAutoHiding);
        const isScrolling = isAutoHiding && access(props.isScrolling);
        const isHovered = isAutoHiding && access(props.isHovered);

        return {
            axis: getAxis(),
            ratio: getRatio(),
            thumbLength: getThumbLength(),
            thumbOffset: ScrollerUtils.computeThumbOffset(getRatio(), getTrackLength(), getThumbLength()),
            isDragging: getIsDragging(),
            isScrolling,
            isHovered,
            isShown: !isAutoHiding || isScrolling || isHovered || getIsDragging(),
        };
    });

    return (
        <div
            role="scrollbar"
            aria-controls={access(props.boxId)}
            aria-orientation={ARIA_ORIENTATIONS[getAxis()]}
            aria-valuemin={0}
            aria-valuemax={ARIA_VALUE_MAX}
            aria-valuenow={getAriaValue()}
            class={[
                styles.scrollerBar,
                styles.scrollerBarVariants[getAxis()],
                access(props.isOverlaid)
                    ? styles.scrollerBarOverlaidVariants[getAxis()]
                    : styles.scrollerBarKeptVariants[getAxis()],
            ].join(" ")}
            style={
                access(props.isOverlaid)
                    ? { [getAxis() === "x" ? "align-self" : "justify-self"]: access(props.side) }
                    : undefined
            }
            onPointerDown={(e) => bar.press(e)}
        >
            {props.renderBar(getRenderProps, refs)}
        </div>
    );
};

export const Scroller = (props: ParentProps<ScrollerProps>) => {
    const generatedId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();
    const [getMetrics, setMetrics] = createSignal(ScrollerUtils.NO_BOX_METRICS);
    const [getIsScrolling, setIsScrolling] = createSignal(false);
    const [getIsHovered, setIsHovered] = createSignal(false);
    const [getHasFocusable, setHasFocusable] = createSignal(false);

    const getId = createMemo(() => access(props.id) ?? generatedId);

    const getGap = createMemo(() => access(props.gap) ?? SCROLLER_DEFAULTS.gap);

    const getPadding = createMemo(() => access(props.padding) ?? SCROLLER_DEFAULTS.padding);

    const getOverlapCount = createMemo(() => access(props.overlapCount) ?? SCROLLER_DEFAULTS.overlapCount);

    const getButtonPlacement = createMemo(() => access(props.buttonPlacement) ?? SCROLLER_DEFAULTS.buttonPlacement);

    const getOverflow = createMemo(() => ({
        x: access(props.overflowX) ?? SCROLLER_DEFAULTS.overflowX,
        y: access(props.overflowY) ?? SCROLLER_DEFAULTS.overflowY,
    }));

    const getIsAutoHiding = createMemo(() => access(props.isAutoHiding) ?? SCROLLER_DEFAULTS.isAutoHiding);

    const getHideDelayMs = () => access(props.hideDelayMs) ?? SCROLLER_DEFAULTS.hideDelayMs;

    const getIsBarOverlaid = createMemo(() => access(props.isBarOverlaid) ?? SCROLLER_DEFAULTS.isBarOverlaid);

    const getBarSides = createMemo(() => ({
        x: access(props.barSideX) ?? SCROLLER_DEFAULTS.barSideX,
        y: access(props.barSideY) ?? SCROLLER_DEFAULTS.barSideY,
    }));

    const getAreaTemplate = createMemo(() => ScrollerUtils.computeAreaTemplate(getBarSides()));

    const getRunAxis = createMemo(() => ScrollerUtils.getRunAxis(getOverflow().x, getOverflow().y));

    const getScrollingAxes = createMemo(() => SCROLLER_AXES.filter((axis) => getOverflow()[axis] !== "hidden"));

    const createStepper = (axis: ScrollerAxis): ScrollerStepper => ({
        getIsAtStart: () => ScrollerUtils.getIsAtStart(getMetrics()[axis]),
        getIsAtEnd: () => ScrollerUtils.getIsAtEnd(getMetrics()[axis]),
        stepToPrevious: () => ScrollerUtils.stepTo(getBoxRef(), "previous", axis, getOverlapCount()),
        stepToNext: () => ScrollerUtils.stepTo(getBoxRef(), "next", axis, getOverlapCount()),
    });

    const steppers = { x: createStepper("x"), y: createStepper("y") };

    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(
        () => props.progress,
        ScrollerUtils.NO_PROGRESS,
    );

    let reportedProgress = ScrollerUtils.NO_PROGRESS;

    createEffect(() => {
        const next = ScrollerUtils.computeProgress(getMetrics());

        if (ScrollerUtils.getIsSameProgress(next, reportedProgress)) return;

        reportedProgress = next;

        setProgress(next);
    });

    createEffect(() => {
        const progress = getProgress();
        const box = getBoxRef();

        if (!box) return;

        ScrollerUtils.scrollToRatios(box, {
            x: progress.x === reportedProgress.x ? undefined : progress.x,
            y: progress.y === reportedProgress.y ? undefined : progress.y,
        });
    });

    const getSteps = createMemo(() => ScrollerUtils.getBoxSteps(getButtonPlacement(), getOverflow(), getMetrics()));

    const getGridTemplate = createMemo(() => ScrollerUtils.computeGridTemplate(getSteps()));

    const getHasBar = (axis: ScrollerAxis) =>
        props.renderBar !== undefined && ScrollerUtils.getHasBar(getOverflow()[axis], getMetrics()[axis]);

    createEffect(() => {
        const box = getBoxRef();

        if (!box) return;

        onCleanup(ScrollerUtils.observe(box, setMetrics));
    });

    createEffect(() => {
        const box = getBoxRef();

        if (!box) return;

        onCleanup(FocusManagerUtils.observeHasFocusable(box, setHasFocusable));
    });

    const getIsBoxTabStop = () =>
        !getHasFocusable() && getScrollingAxes().some((axis) => ScrollerUtils.getIsScrollable(getMetrics()[axis]));

    createEffect(() => {
        const root = getRootRef();
        const box = getBoxRef();
        const isAutoHiding = getIsAutoHiding();

        if (!root || !box || !isAutoHiding) return;

        onCleanup(
            ScrollerUtils.observeActivity(root, box, {
                getHideDelayMs,
                onScrollingChange: setIsScrolling,
                onHoveredChange: setIsHovered,
            }),
        );
    });

    const handleFocusIn = (e: FocusEvent) => {
        const box = getBoxRef();
        const target = e.target as HTMLElement | null;

        if (!box || !target || target === box) return;

        ScrollerUtils.reveal(box, target, getPadding(), getScrollingAxes());
    };

    const renderSteps = (axis: ScrollerAxis, side: "leading" | "trailing") => (
        <Show when={getSteps()[axis][side].length > 0}>
            <div
                class={[styles.scrollerSteps, styles.scrollerStepsVariants[axis]].join(" ")}
                style={{
                    "grid-area": STEP_AREAS[axis][side],
                    "gap": `${getGap()}px`,
                }}
            >
                <Index each={getSteps()[axis][side]}>
                    {(getStep) => props.renderButton(getStep, steppers[axis], axis)}
                </Index>
            </div>
        </Show>
    );

    const renderBar = (axis: ScrollerAxis) => (
        <Show when={getHasBar(axis)}>
            <ScrollerBar
                axis={axis}
                boxId={getId}
                boxRef={getBoxRef}
                rootRef={getRootRef}
                metrics={() => getMetrics()[axis]}
                isOverlaid={getIsBarOverlaid}
                side={() => getBarSides()[axis]}
                isAutoHiding={getIsAutoHiding}
                isScrolling={getIsScrolling}
                isHovered={getIsHovered}
                overlapCount={getOverlapCount}
                computeProgressAtPoint={props.computeProgressAtPoint}
                renderBar={props.renderBar!}
            />
        </Show>
    );

    return (
        <div
            ref={setRootRef}
            class={styles.scrollerRoot}
            style={{
                "gap": `${getGap()}px`,
                "grid-template-areas": getGridTemplate().areas,
                "grid-template-columns": getGridTemplate().columns,
                "grid-template-rows": getGridTemplate().rows,
            }}
        >
            {renderSteps("y", "leading")}
            {renderSteps("x", "leading")}

            <div
                class={styles.scrollerArea}
                style={{
                    "grid-area": ScrollerUtils.AREAS.area,
                    "grid-template-areas": getAreaTemplate().areas,
                    "grid-template-columns": getAreaTemplate().columns,
                    "grid-template-rows": getAreaTemplate().rows,
                }}
            >
                <div
                    id={getId()}
                    ref={setBoxRef}
                    tabIndex={getIsBoxTabStop() ? 0 : undefined}
                    class={[
                        styles.scrollerBox,
                        styles.scrollerBoxVariants[getRunAxis()],
                        getScrollingAxes().length > 1 ? styles.scrollerBoxBothWays : "",
                    ].join(" ")}
                    style={{
                        "overflow-x": getOverflow().x,
                        "overflow-y": getOverflow().y,
                        "padding-block": getRunAxis() === "x" ? `${getPadding()}px` : undefined,
                        "padding-block-start": getRunAxis() === "y" ? `${getPadding()}px` : undefined,
                        "padding-inline": getRunAxis() === "y" ? `${getPadding()}px` : undefined,
                        "padding-inline-start": getRunAxis() === "x" ? `${getPadding()}px` : undefined,
                    }}
                    onFocusIn={handleFocusIn}
                >
                    {props.children}

                    <div class={styles.scrollerBoxEnd} style={{ "flex-basis": `${getPadding()}px` }} />
                </div>

                {renderBar("x")}
                {renderBar("y")}
            </div>

            {renderSteps("x", "trailing")}
            {renderSteps("y", "trailing")}
        </div>
    );
};
