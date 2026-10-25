import {
    type ComponentPublicInstance,
    type SlotsType,
    computed,
    defineComponent,
    onScopeDispose,
    shallowRef,
    useId,
    watch,
} from "vue";

import {
    FocusManagerUtils,
    SCROLLER_AXES,
    SCROLLER_DEFAULTS,
    type ScrollerAxis,
    type ScrollerBarRenderProps,
    type ScrollerController,
    type ScrollerStepper,
    ScrollerStyles,
    ScrollerUtils,
} from "@thewaver/ss-components";
import { FunctionUtils } from "@thewaver/ss-utils";

import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { ScrollerBarProps, ScrollerBarSlots, ScrollerProps, ScrollerSlots } from "./Scroller.types";

const ARIA_VALUE_MAX = 100;
const ARIA_VALUE_THROTTLE_MS = 100;

const ARIA_ORIENTATIONS: Record<ScrollerAxis, "horizontal" | "vertical"> = { x: "horizontal", y: "vertical" };

const ScrollerBar = defineComponent(
    (props: ScrollerBarProps, { slots }: SlotsContext<ScrollerBarSlots>) => {
        const trackRef = shallowRef<HTMLElement>();
        const thumbRef = shallowRef<HTMLElement>();
        const trackLength = shallowRef(0);
        const isDragging = shallowRef(false);
        const ariaValue = shallowRef(0);

        const bar = ScrollerUtils.createBar({
            axis: props.axis,
            getBox: () => props.boxRef,
            getTrack: () => trackRef.value,
            getThumb: () => thumbRef.value,
            getOverlapCount: () => props.overlapCount,
            getComputeProgressAtPoint: () => props.computeProgressAtPoint,
            onDraggingChange: (next) => {
                isDragging.value = next;
            },
        });

        onScopeDispose(bar.stop);

        const setTrackRef = (target: Element | ComponentPublicInstance | null) => {
            trackRef.value = toElement(target);
        };

        const setThumbRef = (target: Element | ComponentPublicInstance | null) => {
            thumbRef.value = toElement(target);
        };

        watchAfterRender([trackRef, () => props.axis], ([track, axis]) => {
            if (!track) return;

            return ScrollerUtils.observeTrackLength(track, axis, (length) => {
                trackLength.value = length;
            });
        });

        watchAfterRender([() => props.rootRef], ([root]) => {
            if (!root) return;

            root.addEventListener("click", bar.swallowClick, true);

            return () => root.removeEventListener("click", bar.swallowClick, true);
        });

        const ratio = computed(() => ScrollerUtils.computeProgressRatio(props.metrics));

        const thumbLength = computed(() => ScrollerUtils.computeThumbLength(props.metrics, trackLength.value));

        const reportAriaValue = FunctionUtils.trailingThrottle((next: number) => {
            ariaValue.value = Math.round(next * ARIA_VALUE_MAX);
        }, ARIA_VALUE_THROTTLE_MS);

        onScopeDispose(reportAriaValue.cancel);

        watch(ratio, (next) => reportAriaValue(next), { immediate: true });

        const renderProps = computed((): ScrollerBarRenderProps => {
            const isScrolling = props.isAutoHiding && props.isScrolling;
            const isHovered = props.isAutoHiding && props.isHovered;

            return {
                axis: props.axis,
                ratio: ratio.value,
                thumbLength: thumbLength.value,
                thumbOffset: ScrollerUtils.computeThumbOffset(ratio.value, trackLength.value, thumbLength.value),
                isDragging: isDragging.value,
                isScrolling,
                isHovered,
                isShown: !props.isAutoHiding || isScrolling || isHovered || isDragging.value,
            };
        });

        return () => {
            const axis = props.axis;

            return (
                <div
                    role="scrollbar"
                    aria-controls={props.boxId}
                    aria-orientation={ARIA_ORIENTATIONS[axis]}
                    aria-valuemin={0}
                    aria-valuemax={ARIA_VALUE_MAX}
                    aria-valuenow={ariaValue.value}
                    class={[
                        ScrollerStyles.scrollerBar,
                        ScrollerStyles.scrollerBarVariants[axis],
                        props.isOverlaid
                            ? ScrollerStyles.scrollerBarOverlaidVariants[axis]
                            : ScrollerStyles.scrollerBarKeptVariants[axis],
                    ]}
                    style={props.isOverlaid ? { [axis === "x" ? "alignSelf" : "justifySelf"]: props.side } : undefined}
                    onPointerdown={(e) => bar.press(e)}
                >
                    {callSlot(slots.renderBar, { renderProps: renderProps.value, setTrackRef, setThumbRef })}
                </div>
            );
        };
    },
    {
        name: "ScrollerBar",
        slots: Object as SlotsType<ScrollerBarSlots>,
        props: declareProps<ScrollerBarProps>({
            axis: null,
            boxId: null,
            boxRef: null,
            rootRef: null,
            metrics: null,
            isOverlaid: Boolean,
            side: null,
            isAutoHiding: Boolean,
            isScrolling: Boolean,
            isHovered: Boolean,
            overlapCount: null,
            computeProgressAtPoint: null,
        }),
    },
);

export const Scroller = defineComponent(
    (props: ScrollerProps, { slots }: SlotsContext<ScrollerSlots>) => {
        const generatedId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const boxRef = shallowRef<HTMLDivElement>();
        const metrics = shallowRef(ScrollerUtils.NO_BOX_METRICS);
        const isScrolling = shallowRef(false);
        const isHovered = shallowRef(false);
        const hasFocusable = shallowRef(false);

        const progress = useTwoWay(props, "progress", ScrollerUtils.NO_PROGRESS);

        const getOverlapCount = () => props.overlapCount ?? SCROLLER_DEFAULTS.overlapCount;
        const getPadding = () => props.padding ?? SCROLLER_DEFAULTS.padding;
        const getIsAutoHiding = () => props.isAutoHiding ?? SCROLLER_DEFAULTS.isAutoHiding;
        const getHideDelayMs = () => props.hideDelayMs ?? SCROLLER_DEFAULTS.hideDelayMs;

        const overflow = computed(() => ({
            x: props.overflowX ?? SCROLLER_DEFAULTS.overflowX,
            y: props.overflowY ?? SCROLLER_DEFAULTS.overflowY,
        }));

        const barSides = computed(() => ({
            x: props.barSideX ?? SCROLLER_DEFAULTS.barSideX,
            y: props.barSideY ?? SCROLLER_DEFAULTS.barSideY,
        }));

        const scrollingAxes = computed(() => SCROLLER_AXES.filter((axis) => overflow.value[axis] !== "hidden"));

        const createStepper = (axis: ScrollerAxis): ScrollerStepper => ({
            getIsAtStart: () => !ScrollerUtils.getCanStep(overflow.value[axis], metrics.value[axis], "previous"),
            getIsAtEnd: () => !ScrollerUtils.getCanStep(overflow.value[axis], metrics.value[axis], "next"),
            stepToPrevious: () =>
                overflow.value[axis] !== "hidden" &&
                ScrollerUtils.stepTo(boxRef.value, "previous", axis, getOverlapCount()),
            stepToNext: () =>
                overflow.value[axis] !== "hidden" &&
                ScrollerUtils.stepTo(boxRef.value, "next", axis, getOverlapCount()),
        });

        const controller: ScrollerController = {
            getBoxId: () => props.id ?? generatedId,
            x: createStepper("x"),
            y: createStepper("y"),
        };

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        let reportedProgress = ScrollerUtils.NO_PROGRESS;

        watchAfterRender([metrics], ([current]) => {
            const next = ScrollerUtils.computeProgress(current);

            if (ScrollerUtils.getIsSameProgress(next, reportedProgress)) return;

            reportedProgress = next;

            progress.value = next;
        });

        watchAfterRender([progress, boxRef], ([current, box]) => {
            if (!box) return;

            ScrollerUtils.scrollToRatios(box, {
                x: current.x === reportedProgress.x ? undefined : current.x,
                y: current.y === reportedProgress.y ? undefined : current.y,
            });
        });

        watchAfterRender([boxRef], ([box]) => {
            if (!box) return;

            return ScrollerUtils.observe(box, (next) => {
                if (!ScrollerUtils.getIsSameBoxMetrics(metrics.value, next)) metrics.value = next;
            });
        });

        watchAfterRender([boxRef], ([box]) => {
            if (!box) return;

            return FocusManagerUtils.observeHasFocusable(box, (next) => {
                hasFocusable.value = next;
            });
        });

        watchAfterRender([rootRef, boxRef, getIsAutoHiding], ([root, box, isAutoHiding]) => {
            if (!root || !box || !isAutoHiding) return;

            return ScrollerUtils.observeActivity(root, box, {
                getHideDelayMs,
                onScrollingChange: (next) => {
                    isScrolling.value = next;
                },
                onHoveredChange: (next) => {
                    isHovered.value = next;
                },
            });
        });

        const handleFocusIn = (e: FocusEvent) => {
            const box = boxRef.value;
            const target = e.target as HTMLElement | null;

            if (!box || !target || target === box) return;

            ScrollerUtils.reveal(box, target, getPadding(), scrollingAxes.value);
        };

        return () => {
            const id = props.id ?? generatedId;
            const padding = getPadding();
            const isAutoHiding = getIsAutoHiding();
            const isBarOverlaid = props.isBarOverlaid ?? SCROLLER_DEFAULTS.isBarOverlaid;
            const areaTemplate = ScrollerUtils.computeAreaTemplate(barSides.value);
            const runAxis = ScrollerUtils.getRunAxis(overflow.value.x, overflow.value.y);
            const isBoxTabStop =
                !hasFocusable.value &&
                scrollingAxes.value.some((axis) => ScrollerUtils.getIsScrollable(metrics.value[axis]));

            const renderBar = (axis: ScrollerAxis) =>
                slots.renderBar !== undefined && ScrollerUtils.getHasBar(overflow.value[axis], metrics.value[axis]) ? (
                    <ScrollerBar
                        key={axis}
                        axis={axis}
                        boxId={id}
                        boxRef={boxRef.value}
                        rootRef={rootRef.value}
                        metrics={metrics.value[axis]}
                        isOverlaid={isBarOverlaid}
                        side={barSides.value[axis]}
                        isAutoHiding={isAutoHiding}
                        isScrolling={isScrolling.value}
                        isHovered={isHovered.value}
                        overlapCount={getOverlapCount()}
                        computeProgressAtPoint={props.computeProgressAtPoint}
                    >
                        {{ renderBar: slots.renderBar } satisfies ScrollerBarSlots}
                    </ScrollerBar>
                ) : null;

            return (
                <div
                    ref={rootRef}
                    class={ScrollerStyles.scrollerRoot}
                    style={{
                        gridTemplateAreas: areaTemplate.areas,
                        gridTemplateColumns: areaTemplate.columns,
                        gridTemplateRows: areaTemplate.rows,
                    }}
                >
                    <div
                        id={id}
                        ref={boxRef}
                        tabindex={isBoxTabStop ? 0 : undefined}
                        class={[
                            ScrollerStyles.scrollerBox,
                            ScrollerStyles.scrollerBoxVariants[runAxis],
                            scrollingAxes.value.length > 1 && ScrollerStyles.scrollerBoxBothWays,
                        ]}
                        style={{
                            overflowX: overflow.value.x,
                            overflowY: overflow.value.y,
                            ...(runAxis === "x"
                                ? { paddingBlock: `${padding}px`, paddingInlineStart: `${padding}px` }
                                : { paddingBlockStart: `${padding}px`, paddingInline: `${padding}px` }),
                        }}
                        onFocusin={handleFocusIn}
                    >
                        {slots.default?.()}

                        <div class={ScrollerStyles.scrollerBoxEnd} style={{ flexBasis: `${padding}px` }} />
                    </div>

                    {renderBar("x")}
                    {renderBar("y")}
                </div>
            );
        };
    },
    {
        name: "Scroller",
        slots: Object as SlotsType<ScrollerSlots>,
        props: declareProps<ScrollerProps>({
            "id": null,
            "padding": null,
            "overlapCount": null,
            "overflowX": null,
            "overflowY": null,
            "barSideX": null,
            "barSideY": null,
            "isAutoHiding": Boolean,
            "hideDelayMs": null,
            "isBarOverlaid": Boolean,
            "onMount": null,
            "computeProgressAtPoint": null,
            "progress": null,
            "onUpdate:progress": null,
        }),
    },
);
