import { computed, defineComponent, shallowRef } from "vue";

import { CELL_ANIMATION_DEFAULTS, CellAnimationStyles, CellAnimationUtils } from "@thewaver/ss-components";
import type { Index2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps, useTwoWay } from "../../../Utils/propUtils";
import type { CellAnimationProps } from "./CellAnimation.types";

const NO_PROGRESS = 0;
const FIRST_ITERATION = 0;
const NO_WEIGHTS: number[][] = [];

export const CellAnimation = defineComponent(
    (props: CellAnimationProps) => {
        const getDurationMs = () => props.animationDurationMs ?? CELL_ANIMATION_DEFAULTS.animationDurationMs;
        const getIterationCount = () =>
            props.animationIterationCount ?? CELL_ANIMATION_DEFAULTS.animationIterationCount;
        const getIterationDelayMs = () =>
            props.animationIterationDelayMs ?? CELL_ANIMATION_DEFAULTS.animationIterationDelayMs;

        const rootRef = shallowRef<HTMLDivElement>();
        const imgRef = shallowRef<HTMLImageElement>();
        const containerRef = shallowRef<HTMLDivElement>();

        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();

        const isPlaying = useTwoWay(props, "playback", true);
        const progress = useTwoWay(props, "progress", NO_PROGRESS);
        const currentIteration = shallowRef(FIRST_ITERATION);

        const rootSize = ElementObserverVueUtils.useBorderBoxSize(imgRef);
        const rootWidth = computed(() => rootSize.value.width);
        const rootHeight = computed(() => rootSize.value.height);

        const cellCount = computed<Index2d>((previous) => {
            const next = CellAnimationUtils.computeCellCount(props.cellCount, rootSize.value);

            return previous && CellAnimationUtils.getIsSameCount(previous, next) ? previous : next;
        });

        const weights = computed(() => props.computeCellWeights?.(cellCount.value) ?? NO_WEIGHTS);

        const columnEdges = computed(() => CellAnimationUtils.computeEdges(rootWidth.value, cellCount.value.col));

        const rowEdges = computed(() => CellAnimationUtils.computeEdges(rootHeight.value, cellCount.value.row));

        const cellDefs = computed(() => CellAnimationUtils.computeCellDefs(cellCount.value, weights.value));

        const evaluationDefs = computed(() =>
            CellAnimationUtils.computeEvaluationDefs(cellDefs.value, columnEdges.value, rowEdges.value),
        );

        const frameState = computed(() =>
            CellAnimationUtils.computeFrameState(
                currentIteration.value,
                getIterationCount(),
                props.finalFrame ?? CELL_ANIMATION_DEFAULTS.finalFrame,
            ),
        );

        const areCellsMounted = computed(() => frameState.value.areCellsMounted);

        const isRunning = computed(() => isPlaying.value && !isPageHidden.value && !frameState.value.hasEnded);

        let drawnSrc = props.src;

        watchAfterRender([() => props.src], ([src]) => {
            if (drawnSrc === src) return;

            drawnSrc = src;
            currentIteration.value = FIRST_ITERATION;
            progress.value = NO_PROGRESS;
        });

        watchAfterRender([progress, evaluationDefs, areCellsMounted], ([currentProgress, defs, isMounted]) => {
            const root = rootRef.value;
            const container = containerRef.value;

            if (!root) return;

            const cells =
                container && isMounted ? (Array.from(container.querySelectorAll(":scope > div")) as HTMLElement[]) : [];

            CellAnimationUtils.drawFrame(
                root,
                cells,
                defs,
                currentProgress,
                props.computeRootAnimation,
                props.computeCellAnimation,
            );
        });

        watchAfterRender([isRunning], ([running]) => {
            if (!running) return;

            return CellAnimationUtils.runPasses({
                getProgress: () => progress.value,
                setProgress: (value) => {
                    progress.value = value;
                },
                getCurrentIteration: () => currentIteration.value,
                setCurrentIteration: (value) => {
                    currentIteration.value = value;
                },
                getDurationMs,
                getIterationCount,
                getIterationDelayMs,
                onIterationEnd: () => props.onIterationEnd?.(),
                onAnimationEnd: () => props.onAnimationEnd?.(),
            });
        });

        return () => {
            const sizeAnchor = props.sizeAnchor ?? CELL_ANIMATION_DEFAULTS.sizeAnchor;
            const size = rootSize.value;

            return (
                <div
                    ref={rootRef}
                    class={CellAnimationStyles.cellAnimationRoot}
                    role={props.ariaLabel ? "img" : undefined}
                    aria-label={props.ariaLabel}
                    aria-hidden={props.ariaLabel ? undefined : "true"}
                >
                    <img
                        ref={imgRef}
                        src={props.src}
                        class={[
                            CellAnimationStyles.cellAnimationAnchor,
                            frameState.value.isSourceRevealed && CellAnimationStyles.cellAnimationAnchorRevealed,
                        ]}
                        width={sizeAnchor === "width" ? "100%" : "auto"}
                        height={sizeAnchor === "height" ? "100%" : "auto"}
                        aria-hidden="true"
                    />

                    <div
                        ref={containerRef}
                        class={CellAnimationStyles.cellAnimationContainer}
                        style={{
                            ...assignInlineVars({
                                [CellAnimationStyles.cellSrcVar]: CellAnimationUtils.toSourceImage(props.src),
                                [CellAnimationStyles.cellSizeVar]: `${size.width}px ${size.height}px`,
                            }),
                            width: `${size.width}px`,
                            height: `${size.height}px`,
                            perspective: CellAnimationUtils.computePerspective(size),
                        }}
                    >
                        {areCellsMounted.value &&
                            cellDefs.value.map((defs, index) => {
                                const bounds = CellAnimationUtils.computeCellBounds(
                                    columnEdges.value,
                                    rowEdges.value,
                                    defs.pos,
                                );

                                return (
                                    <div
                                        key={index}
                                        class={CellAnimationStyles.cellAnimationCell}
                                        style={{
                                            left: `${bounds.col}px`,
                                            top: `${bounds.row}px`,
                                            width: `${bounds.width}px`,
                                            height: `${bounds.height}px`,
                                            backgroundPosition: `${-bounds.col}px ${-bounds.row}px`,
                                            zIndex: CellAnimationUtils.computeCellDepth(defs.weight),
                                        }}
                                        aria-hidden="true"
                                    />
                                );
                            })}
                    </div>
                </div>
            );
        };
    },
    {
        name: "CellAnimation",
        props: declareProps<CellAnimationProps>({
            "src": null,
            "ariaLabel": null,
            "sizeAnchor": null,
            "cellCount": null,
            "animationDurationMs": null,
            "animationIterationCount": null,
            "animationIterationDelayMs": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "progress": null,
            "onUpdate:progress": null,
            "finalFrame": null,
            "computeCellWeights": null,
            "computeRootAnimation": null,
            "computeCellAnimation": null,
            "onIterationEnd": null,
            "onAnimationEnd": null,
        }),
    },
);
