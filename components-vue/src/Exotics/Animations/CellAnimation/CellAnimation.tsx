import { computed, defineComponent, shallowRef } from "vue";

import {
    CELL_ANIMATION_DEFAULTS,
    CellAnimationStyles,
    CellAnimationUtils,
    SliceAnimationUtils,
    SliceRendererStyles,
    SliceRendererUtils,
} from "@thewaver/ss-components";
import { CellAnimationConst } from "@thewaver/ss-components/internal";
import { type Index2d, MathUtils, Rect } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { SliceRendererVueUtils } from "../../../Abstracts/SliceRenderer/SliceRendererVue.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps, useTwoWay } from "../../../Utils/propUtils";
import type { CellAnimationProps } from "./CellAnimation.types";

const NO_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const CellAnimation = defineComponent(
    (props: CellAnimationProps) => {
        const viewportContext = useViewportContext();

        const getDurationMs = () => props.animationDurationMs ?? CELL_ANIMATION_DEFAULTS.animationDurationMs;
        const getIterationCount = () =>
            props.animationIterationCount ?? CELL_ANIMATION_DEFAULTS.animationIterationCount;
        const getIterationDelayMs = () =>
            props.animationIterationDelayMs ?? CELL_ANIMATION_DEFAULTS.animationIterationDelayMs;
        const getCycleDurationMs = () =>
            SliceAnimationUtils.computeCycleDurationMs(getDurationMs(), props.playbackOpts);

        const rootRef = shallowRef<HTMLDivElement>();
        const imgRef = shallowRef<HTMLImageElement>();
        const containerRef = shallowRef<HTMLDivElement>();
        const canvasRef = shallowRef<HTMLCanvasElement>();

        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();

        const isPlaying = useTwoWay(props, "playback", true);
        const progress = useTwoWay(props, "progress", CellAnimationConst.NO_PROGRESS);
        const currentIteration = shallowRef(CellAnimationConst.FIRST_ITERATION);
        const shownRect = shallowRef<Rect>(NO_RECT);

        const rootSize = ElementObserverVueUtils.useBorderBoxSize(imgRef);
        const rootWidth = computed(() => rootSize.value.width);
        const rootHeight = computed(() => rootSize.value.height);

        const cellCount = computed<Index2d>((previous) => {
            const next = CellAnimationUtils.computeCellCount(props.cellCount, rootSize.value);

            return previous && CellAnimationUtils.getIsSameCount(previous, next) ? previous : next;
        });

        const weights = computed(() => props.computeSliceWeights?.(cellCount.value) ?? CellAnimationConst.NO_WEIGHTS);

        const columnEdges = computed(() => CellAnimationUtils.computeEdges(rootWidth.value, cellCount.value.col));

        const rowEdges = computed(() => CellAnimationUtils.computeEdges(rootHeight.value, cellCount.value.row));

        const cellDefs = computed(() => CellAnimationUtils.computeCellDefs(cellCount.value, weights.value));

        const evaluationDefs = computed(() =>
            CellAnimationUtils.computeEvaluationDefs(cellDefs.value, columnEdges.value, rowEdges.value),
        );

        const slices = computed(() =>
            SliceAnimationUtils.withOrigin(evaluationDefs.value, props.origin ?? CELL_ANIMATION_DEFAULTS.origin),
        );

        const frameState = computed(() =>
            CellAnimationUtils.computeFrameState(
                currentIteration.value,
                getIterationCount(),
                props.finalFrame ?? CELL_ANIMATION_DEFAULTS.finalFrame,
            ),
        );

        const areCellsMounted = computed(() => frameState.value.areCellsMounted);

        const timing = computed(() =>
            SliceAnimationUtils.computeTiming(
                progress.value,
                getDurationMs(),
                props.breakpointOpts,
                props.playbackOpts,
            ),
        );

        const renderer = computed(() => props.renderer ?? CELL_ANIMATION_DEFAULTS.renderer);

        const isElementsOnly = computed(() => renderer.value === "elements");

        const isAvailable = SliceRendererVueUtils.useIsAvailable(isElementsOnly);

        const picture = SliceRendererVueUtils.usePicture(() => props.src, isElementsOnly);

        const tables = computed(() =>
            isElementsOnly.value
                ? undefined
                : SliceAnimationUtils.resolveTables(props.computeSliceAnimation, slices.value),
        );

        const isOnGraphicsCard = computed(
            () => isAvailable.value && SliceRendererUtils.getCanDraw(renderer.value, picture.value) && !!tables.value,
        );

        const item = SliceRendererVueUtils.useItem(canvasRef, isAvailable);

        const easing = computed(() => SliceRendererUtils.computeEasing(props.breakpointOpts?.easing));

        const rendererSlices = computed(() => {
            const tableIndices = tables.value?.tableIndices ?? [];

            return cellDefs.value.map((defs, idx) => {
                const bounds = CellAnimationUtils.computeCellBounds(columnEdges.value, rowEdges.value, defs.pos);

                return {
                    left: bounds.col,
                    top: bounds.row,
                    width: bounds.width,
                    height: bounds.height,
                    weight: defs.weight,
                    table: tableIndices[idx] ?? 0,
                };
            });
        });

        const area = computed(() => {
            const size = rootSize.value;
            const largest = evaluationDefs.value.reduce(
                (most, defs) => ({
                    width: Math.max(most.width, defs.size.width),
                    height: Math.max(most.height, defs.size.height),
                }),
                { width: 0, height: 0 },
            );
            const reach = SliceRendererUtils.computeReach(tables.value?.tables ?? [], largest, size);

            return { x: -reach, y: -reach, width: size.width + 2 * reach, height: size.height + 2 * reach };
        });

        const isRunning = computed(
            () =>
                isPlaying.value &&
                !isPageHidden.value &&
                !frameState.value.hasEnded &&
                !!rootRef.value &&
                (isOnGraphicsCard.value ? !!item.value : !!containerRef.value),
        );

        let drawnSrc = props.src;

        watchAfterRender([() => props.src], ([src]) => {
            if (drawnSrc === src) return;

            drawnSrc = src;
            currentIteration.value = CellAnimationConst.FIRST_ITERATION;
            progress.value = CellAnimationConst.NO_PROGRESS;
        });

        watchAfterRender(
            [progress, timing, slices, areCellsMounted, isOnGraphicsCard],
            ([currentProgress, currentTiming, currentSlices, isMounted, isOnCard]) => {
                const root = rootRef.value;
                const container = containerRef.value;

                if (!root || isOnCard) return;

                const cells =
                    container && isMounted
                        ? (Array.from(container.querySelectorAll(":scope > div")) as HTMLElement[])
                        : [];

                CellAnimationUtils.drawFrame(
                    root,
                    cells,
                    currentSlices,
                    currentProgress,
                    currentTiming,
                    props.computeRootAnimation,
                    props.computeSliceAnimation,
                );
            },
        );

        watchAfterRender(
            [
                item,
                progress,
                timing,
                tables,
                rendererSlices,
                area,
                easing,
                rootSize,
                areCellsMounted,
                isOnGraphicsCard,
                picture,
            ],
            ([
                currentItem,
                currentProgress,
                currentTiming,
                currentTables,
                currentSlices,
                currentArea,
                currentEasing,
                size,
                isShown,
                isOnCard,
            ]) => {
                const root = rootRef.value;

                if (!root || !currentItem || !isOnCard) return;

                if (props.computeRootAnimation) {
                    SliceAnimationUtils.assignAnimationProps(
                        root,
                        props.computeRootAnimation(MathUtils.clamp01(currentProgress)),
                    );
                }

                const scale = window.devicePixelRatio * viewportContext.getScale();
                const sliceWindow = SliceAnimationUtils.computeWindow(currentTiming);
                currentItem.draw(
                    {
                        mode: "slices",
                        src: props.src,
                        tables: currentTables?.tables ?? [],
                        easing: currentEasing,
                        slices: currentSlices,
                        size,
                        area: currentArea,
                        scale,
                        timeline: currentTiming.globalTimeline,
                        half: sliceWindow.half,
                        isDescending: sliceWindow.isDescending,
                        isShown,
                        hasPerspective: true,
                    },
                    (next) => {
                        if (!Rect.isSame(shownRect.value, next)) shownRect.value = next;
                    },
                );
            },
        );

        watchAfterRender([isRunning], ([running]) => {
            if (!running) return;

            return SliceAnimationUtils.runPasses({
                getProgress: () => progress.value,
                setProgress: (value) => {
                    progress.value = value;
                },
                getCurrentIteration: () => currentIteration.value,
                setCurrentIteration: (value) => {
                    currentIteration.value = value;
                },
                getDurationMs: getCycleDurationMs,
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

                    {isOnGraphicsCard.value ? (
                        <div
                            key="canvas"
                            class={CellAnimationStyles.cellAnimationContainer}
                            style={{ width: `${size.width}px`, height: `${size.height}px` }}
                        >
                            <canvas
                                ref={canvasRef}
                                class={SliceRendererStyles.sliceRendererCanvas}
                                style={{
                                    left: `${shownRect.value.x}px`,
                                    top: `${shownRect.value.y}px`,
                                    width: `${shownRect.value.width}px`,
                                    height: `${shownRect.value.height}px`,
                                }}
                                aria-hidden="true"
                            />
                        </div>
                    ) : (
                        <div
                            key="cells"
                            ref={containerRef}
                            class={[
                                CellAnimationStyles.cellAnimationContainer,
                                isRunning.value && CellAnimationStyles.cellAnimationContainerMoving,
                            ]}
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
                    )}
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
            "origin": null,
            "breakpointOpts": null,
            "playbackOpts": null,
            "renderer": null,
            "computeSliceWeights": null,
            "computeRootAnimation": null,
            "computeSliceAnimation": null,
            "onIterationEnd": null,
            "onAnimationEnd": null,
        }),
    },
);
