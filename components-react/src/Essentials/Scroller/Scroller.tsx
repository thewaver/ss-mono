import { type FocusEvent, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import {
    FocusManagerUtils,
    SCROLLER_AXES,
    SCROLLER_DEFAULTS,
    type ScrollerAxis,
    type ScrollerBarRefs,
    type ScrollerBarRenderProps,
    type ScrollerProgress,
    type ScrollerStep,
    type ScrollerStepper,
    ScrollerStyles,
    ScrollerUtils,
} from "@thewaver/ss-components";
import { FunctionUtils, StoreUtils } from "@thewaver/ss-utils";

import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useElement, useLatest } from "../../Utils/refUtils";
import type { ScrollerBarProps, ScrollerController, ScrollerProps } from "./Scroller.types";

type StepperSnapshot = { isAtStart: boolean; isAtEnd: boolean };

type ControllerSnapshot = Record<ScrollerAxis, StepperSnapshot> & { boxId: string };

const ARIA_VALUE_MAX = 100;
const ARIA_VALUE_THROTTLE_MS = 100;

const ARIA_ORIENTATIONS: Record<ScrollerAxis, "horizontal" | "vertical"> = { x: "horizontal", y: "vertical" };

const getIsSameSnapshot = (a: ControllerSnapshot, b: ControllerSnapshot) =>
    a.boxId === b.boxId &&
    SCROLLER_AXES.every((axis) => a[axis].isAtStart === b[axis].isAtStart && a[axis].isAtEnd === b[axis].isAtEnd);

const ScrollerBar = (props: ScrollerBarProps) => {
    const [track, setTrack] = useState<HTMLElement>();
    const [thumb, setThumb] = useState<HTMLElement>();
    const [trackLength, setTrackLength] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [ariaValue, setAriaValue] = useState(0);

    const latest = useLatest(props);
    const latestParts = useLatest({ track, thumb });

    const [bar] = useState(() =>
        ScrollerUtils.createBar({
            axis: props.axis,
            getBox: () => latest.current.boxRef,
            getTrack: () => latestParts.current.track,
            getThumb: () => latestParts.current.thumb,
            getOverlapCount: () => latest.current.overlapCount,
            getComputeProgressAtPoint: () => latest.current.computeProgressAtPoint,
            onDraggingChange: setIsDragging,
        }),
    );

    useEffect(() => bar.stop, [bar]);

    const [refs] = useState<ScrollerBarRefs>(() => ({ setTrackRef: setTrack, setThumbRef: setThumb }));

    useLayoutEffect(() => {
        if (!track) return undefined;

        return ScrollerUtils.observeTrackLength(track, props.axis, setTrackLength);
    }, [track, props.axis]);

    useEffect(() => {
        const root = props.rootRef;

        if (!root) return undefined;

        root.addEventListener("click", bar.swallowClick, true);

        return () => root.removeEventListener("click", bar.swallowClick, true);
    }, [props.rootRef, bar]);

    const ratio = ScrollerUtils.computeProgressRatio(props.metrics);
    const thumbLength = ScrollerUtils.computeThumbLength(props.metrics, trackLength);

    const [reportAriaValue] = useState(() =>
        FunctionUtils.trailingThrottle(
            (next: number) => setAriaValue(Math.round(next * ARIA_VALUE_MAX)),
            ARIA_VALUE_THROTTLE_MS,
        ),
    );

    useEffect(() => reportAriaValue.cancel, [reportAriaValue]);

    useEffect(() => reportAriaValue(ratio), [ratio, reportAriaValue]);

    const isScrolling = props.isAutoHiding && props.isScrolling;
    const isHovered = props.isAutoHiding && props.isHovered;

    const renderProps: ScrollerBarRenderProps = {
        axis: props.axis,
        ratio,
        thumbLength,
        thumbOffset: ScrollerUtils.computeThumbOffset(ratio, trackLength, thumbLength),
        isDragging,
        isScrolling,
        isHovered,
        isShown: !props.isAutoHiding || isScrolling || isHovered || isDragging,
    };

    return (
        <div
            role="scrollbar"
            aria-controls={props.boxId}
            aria-orientation={ARIA_ORIENTATIONS[props.axis]}
            aria-valuemin={0}
            aria-valuemax={ARIA_VALUE_MAX}
            aria-valuenow={ariaValue}
            className={[
                ScrollerStyles.scrollerBar,
                ScrollerStyles.scrollerBarVariants[props.axis],
                props.isOverlaid
                    ? ScrollerStyles.scrollerBarOverlaidVariants[props.axis]
                    : ScrollerStyles.scrollerBarKeptVariants[props.axis],
            ].join(" ")}
            style={props.isOverlaid ? { [props.axis === "x" ? "alignSelf" : "justifySelf"]: props.side } : undefined}
            onPointerDown={(e) => bar.press(e.nativeEvent)}
        >
            {props.renderBar(renderProps, refs)}
        </div>
    );
};

export const Scroller = (props: ScrollerProps) => {
    const generatedId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const root = useElement(rootRef);
    const box = useElement(boxRef);
    const latest = useLatest(props);

    const [metrics, setMetrics] = useState(ScrollerUtils.NO_BOX_METRICS);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hasFocusable, setHasFocusable] = useState(false);
    const [progress, setProgress] = SignalMirrorReactUtils.useOptionalState(props.progress, ScrollerUtils.NO_PROGRESS);

    const reportedProgressRef = useRef<ScrollerProgress>(ScrollerUtils.NO_PROGRESS);

    const id = props.id ?? generatedId;
    const padding = props.padding ?? SCROLLER_DEFAULTS.padding;
    const overlapCount = props.overlapCount ?? SCROLLER_DEFAULTS.overlapCount;
    const overflowX = props.overflowX ?? SCROLLER_DEFAULTS.overflowX;
    const overflowY = props.overflowY ?? SCROLLER_DEFAULTS.overflowY;
    const isAutoHiding = props.isAutoHiding ?? SCROLLER_DEFAULTS.isAutoHiding;
    const isBarOverlaid = props.isBarOverlaid ?? SCROLLER_DEFAULTS.isBarOverlaid;
    const barSideX = props.barSideX ?? SCROLLER_DEFAULTS.barSideX;
    const barSideY = props.barSideY ?? SCROLLER_DEFAULTS.barSideY;

    const overflow = { x: overflowX, y: overflowY };
    const barSides = { x: barSideX, y: barSideY };
    const areaTemplate = ScrollerUtils.computeAreaTemplate(barSides);
    const runAxis = ScrollerUtils.getRunAxis(overflowX, overflowY);
    const scrollingAxes = SCROLLER_AXES.filter((axis) => overflow[axis] !== "hidden");

    const computeStepperSnapshot = (axis: ScrollerAxis): StepperSnapshot => ({
        isAtStart: !ScrollerUtils.getCanStep(overflow[axis], metrics[axis], "previous"),
        isAtEnd: !ScrollerUtils.getCanStep(overflow[axis], metrics[axis], "next"),
    });

    const snapshot: ControllerSnapshot = { boxId: id, x: computeStepperSnapshot("x"), y: computeStepperSnapshot("y") };

    const [controllerStore] = useState(() => StoreUtils.create(snapshot, { isEqual: getIsSameSnapshot }));

    useLayoutEffect(() => {
        controllerStore.set(snapshot);
    });

    const latestStepping = useLatest({ overflow, overlapCount });

    const [controller] = useState((): ScrollerController => {
        const createStepper = (axis: ScrollerAxis): ScrollerStepper => {
            const stepTo = (step: ScrollerStep) => {
                const current = latestStepping.current;

                return (
                    current.overflow[axis] !== "hidden" &&
                    ScrollerUtils.stepTo(boxRef.current ?? undefined, step, axis, current.overlapCount)
                );
            };

            return {
                getIsAtStart: () => controllerStore.get()[axis].isAtStart,
                getIsAtEnd: () => controllerStore.get()[axis].isAtEnd,
                stepToPrevious: () => stepTo("previous"),
                stepToNext: () => stepTo("next"),
            };
        };

        return {
            getBoxId: () => controllerStore.get().boxId,
            x: createStepper("x"),
            y: createStepper("y"),
            subscribe: controllerStore.subscribe,
        };
    });

    useEffect(() => {
        props.onMount?.(controller);
    }, [controller]);

    useLayoutEffect(() => {
        if (!box) return undefined;

        return ScrollerUtils.observe(box, (next) =>
            setMetrics((prev) => (ScrollerUtils.getIsSameBoxMetrics(prev, next) ? prev : next)),
        );
    }, [box]);

    useEffect(() => {
        const next = ScrollerUtils.computeProgress(metrics);

        if (ScrollerUtils.getIsSameProgress(next, reportedProgressRef.current)) return;

        reportedProgressRef.current = next;

        setProgress(next);
    }, [metrics]);

    useEffect(() => {
        if (!box) return;

        ScrollerUtils.scrollToRatios(box, {
            x: progress.x === reportedProgressRef.current.x ? undefined : progress.x,
            y: progress.y === reportedProgressRef.current.y ? undefined : progress.y,
        });
    }, [box, progress]);

    useEffect(() => {
        if (!box) return undefined;

        return FocusManagerUtils.observeHasFocusable(box, setHasFocusable);
    }, [box]);

    useEffect(() => {
        if (!root || !box || !isAutoHiding) return undefined;

        return ScrollerUtils.observeActivity(root, box, {
            getHideDelayMs: () => latest.current.hideDelayMs ?? SCROLLER_DEFAULTS.hideDelayMs,
            onScrollingChange: setIsScrolling,
            onHoveredChange: setIsHovered,
        });
    }, [root, box, isAutoHiding, latest]);

    const isBoxTabStop = !hasFocusable && scrollingAxes.some((axis) => ScrollerUtils.getIsScrollable(metrics[axis]));

    const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement | null;

        if (!box || !target || target === box) return;

        ScrollerUtils.reveal(box, target, padding, scrollingAxes);
    };

    const renderBar = (axis: ScrollerAxis) =>
        props.renderBar !== undefined &&
        ScrollerUtils.getHasBar(overflow[axis], metrics[axis]) && (
            <ScrollerBar
                axis={axis}
                boxId={id}
                boxRef={box}
                rootRef={root}
                metrics={metrics[axis]}
                isOverlaid={isBarOverlaid}
                side={barSides[axis]}
                isAutoHiding={isAutoHiding}
                isScrolling={isScrolling}
                isHovered={isHovered}
                overlapCount={overlapCount}
                computeProgressAtPoint={props.computeProgressAtPoint}
                renderBar={props.renderBar}
            />
        );

    return (
        <div
            ref={rootRef}
            className={ScrollerStyles.scrollerRoot}
            style={{
                gridTemplateAreas: areaTemplate.areas,
                gridTemplateColumns: areaTemplate.columns,
                gridTemplateRows: areaTemplate.rows,
            }}
        >
            <div
                id={id}
                ref={boxRef}
                tabIndex={isBoxTabStop ? 0 : undefined}
                className={[
                    ScrollerStyles.scrollerBox,
                    ScrollerStyles.scrollerBoxVariants[runAxis],
                    scrollingAxes.length > 1 ? ScrollerStyles.scrollerBoxBothWays : "",
                ].join(" ")}
                style={{
                    overflowX,
                    overflowY,
                    ...(runAxis === "x"
                        ? { paddingBlock: `${padding}px`, paddingInlineStart: `${padding}px` }
                        : { paddingBlockStart: `${padding}px`, paddingInline: `${padding}px` }),
                }}
                onFocus={handleFocus}
            >
                {props.children}

                <div className={ScrollerStyles.scrollerBoxEnd} style={{ flexBasis: `${padding}px` }} />
            </div>

            {renderBar("x")}
            {renderBar("y")}
        </div>
    );
};
