import { type CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    CELL_ANIMATION_DEFAULTS,
    CellAnimationStyles,
    CellAnimationUtils,
    SliceAnimationUtils,
    SliceRendererStyles,
    SliceRendererUtils,
} from "@thewaver/ss-components";
import { CellAnimationConst } from "@thewaver/ss-components/internal";
import { MathUtils, Size2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { SliceRendererReactUtils } from "../../../Abstracts/SliceRenderer/SliceRendererReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { useLatest } from "../../../Utils/refUtils";
import type { CellAnimationProps } from "./CellAnimation.types";

export const CellAnimation = (props: CellAnimationProps) => {
    const durationMs = props.animationDurationMs ?? CELL_ANIMATION_DEFAULTS.animationDurationMs;
    const iterationCount = props.animationIterationCount ?? CELL_ANIMATION_DEFAULTS.animationIterationCount;
    const iterationDelayMs = props.animationIterationDelayMs ?? CELL_ANIMATION_DEFAULTS.animationIterationDelayMs;
    const sizeAnchor = props.sizeAnchor ?? CELL_ANIMATION_DEFAULTS.sizeAnchor;
    const finalFrame = props.finalFrame ?? CELL_ANIMATION_DEFAULTS.finalFrame;
    const origin = props.origin ?? CELL_ANIMATION_DEFAULTS.origin;
    const renderer = props.renderer ?? CELL_ANIMATION_DEFAULTS.renderer;
    const cycleDurationMs = SliceAnimationUtils.computeCycleDurationMs(durationMs, props.playbackOpts);

    const viewportContext = useViewportContext();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const isPageHidden = InteractionTrackerReactUtils.usePageHidden();

    const [isPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, true);
    const [progress, setProgressState] = SignalMirrorReactUtils.useOptionalState(
        props.progress,
        CellAnimationConst.NO_PROGRESS,
    );
    const [currentIteration, setCurrentIterationState] = useState(CellAnimationConst.FIRST_ITERATION);
    const [shownSize, setShownSize] = useState<Size2d>({ width: 0, height: 0 });

    const rootSize = ElementObserverReactUtils.useBorderBoxSize(imgRef);

    const progressRef = useLatest(progress);
    const iterationRef = useLatest(currentIteration);

    const setProgress = (value: number) => {
        progressRef.current = value;
        setProgressState(value);
    };

    const setCurrentIteration = (value: number) => {
        iterationRef.current = value;
        setCurrentIterationState(value);
    };

    const latest = useLatest({
        props,
        durationMs,
        cycleDurationMs,
        iterationCount,
        iterationDelayMs,
        setProgress,
        setCurrentIteration,
    });

    const cellCount = CellAnimationUtils.computeCellCount(props.cellCount, rootSize);

    const weights = useMemo(
        () => props.computeSliceWeights?.(cellCount) ?? CellAnimationConst.NO_WEIGHTS,
        [props.computeSliceWeights, cellCount.col, cellCount.row],
    );

    const columnEdges = useMemo(
        () => CellAnimationUtils.computeEdges(rootSize.width, cellCount.col),
        [rootSize.width, cellCount.col],
    );

    const rowEdges = useMemo(
        () => CellAnimationUtils.computeEdges(rootSize.height, cellCount.row),
        [rootSize.height, cellCount.row],
    );

    const cellDefs = useMemo(
        () => CellAnimationUtils.computeCellDefs(cellCount, weights),
        [cellCount.col, cellCount.row, weights],
    );

    const evaluationDefs = useMemo(
        () => CellAnimationUtils.computeEvaluationDefs(cellDefs, columnEdges, rowEdges),
        [cellDefs, columnEdges, rowEdges],
    );

    const slices = useMemo(
        () => SliceAnimationUtils.withOrigin(evaluationDefs, origin),
        [evaluationDefs, origin.row, origin.col],
    );

    const isElementsOnly = renderer === "elements";

    const isAvailable = SliceRendererReactUtils.useIsAvailable(isElementsOnly);

    const picture = SliceRendererReactUtils.usePicture(props.src, isElementsOnly);

    const tables = useMemo(
        () => (isElementsOnly ? undefined : SliceAnimationUtils.resolveTables(props.computeSliceAnimation, slices)),
        [isElementsOnly, props.computeSliceAnimation, slices],
    );

    const isOnGraphicsCard = isAvailable && SliceRendererUtils.getCanDraw(renderer, picture) && !!tables;

    const item = SliceRendererReactUtils.useItem(canvasRef, isAvailable);

    const easing = useMemo(
        () => SliceRendererUtils.computeEasing(props.breakpointOpts?.easing),
        [props.breakpointOpts?.easing],
    );

    const rendererSlices = useMemo(() => {
        const tableIndices = tables?.tableIndices ?? [];

        return cellDefs.map((defs, idx) => {
            const bounds = CellAnimationUtils.computeCellBounds(columnEdges, rowEdges, defs.pos);

            return {
                left: bounds.col,
                top: bounds.row,
                width: bounds.width,
                height: bounds.height,
                weight: defs.weight,
                table: tableIndices[idx] ?? 0,
            };
        });
    }, [cellDefs, columnEdges, rowEdges, tables]);

    const area = useMemo(() => {
        const largest = evaluationDefs.reduce(
            (most, defs) => ({
                width: Math.max(most.width, defs.size.width),
                height: Math.max(most.height, defs.size.height),
            }),
            { width: 0, height: 0 },
        );
        const reach = SliceRendererUtils.computeReach(tables?.tables ?? [], largest, rootSize);

        return { x: -reach, y: -reach, width: rootSize.width + 2 * reach, height: rootSize.height + 2 * reach };
    }, [evaluationDefs, tables, rootSize]);

    const { hasEnded, areCellsMounted, isSourceRevealed } = CellAnimationUtils.computeFrameState(
        currentIteration,
        iterationCount,
        finalFrame,
    );

    const isRunning = isPlaying && !isPageHidden && !hasEnded && (!isOnGraphicsCard || !!item);

    const drawnSrcRef = useRef(props.src);

    useLayoutEffect(() => {
        if (drawnSrcRef.current === props.src) return;

        drawnSrcRef.current = props.src;
        latest.current.setCurrentIteration(CellAnimationConst.FIRST_ITERATION);
        latest.current.setProgress(CellAnimationConst.NO_PROGRESS);
    }, [props.src]);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const container = containerRef.current;

        if (!root || isOnGraphicsCard) return;

        const cells =
            container && areCellsMounted
                ? (Array.from(container.querySelectorAll(":scope > div")) as HTMLElement[])
                : [];
        const current = latest.current;

        CellAnimationUtils.drawFrame(
            root,
            cells,
            slices,
            progress,
            SliceAnimationUtils.computeTiming(
                progress,
                current.durationMs,
                current.props.breakpointOpts,
                current.props.playbackOpts,
            ),
            current.props.computeRootAnimation,
            current.props.computeSliceAnimation,
        );
    }, [progress, slices, areCellsMounted, isOnGraphicsCard, props.breakpointOpts, props.playbackOpts]);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root || !item || !isOnGraphicsCard) return;

        const current = latest.current;
        const timing = SliceAnimationUtils.computeTiming(
            progress,
            current.durationMs,
            current.props.breakpointOpts,
            current.props.playbackOpts,
        );

        if (current.props.computeRootAnimation) {
            SliceAnimationUtils.assignAnimationProps(
                root,
                current.props.computeRootAnimation(MathUtils.clamp01(progress)),
            );
        }

        const scale = window.devicePixelRatio * viewportContext.getScale();
        const sliceWindow = SliceAnimationUtils.computeWindow(timing);
        const shown = item.draw({
            mode: "slices",
            src: current.props.src,
            tables: tables?.tables ?? [],
            easing,
            slices: rendererSlices,
            size: rootSize,
            area,
            scale,
            timeline: timing.globalTimeline,
            half: sliceWindow.half,
            isDescending: sliceWindow.isDescending,
            isShown: areCellsMounted,
            hasPerspective: true,
        });
        const next = { width: shown.width / scale, height: shown.height / scale };

        setShownSize((previous) => (Size2d.isSame(previous, next) ? previous : next));
    }, [
        item,
        progress,
        isOnGraphicsCard,
        tables,
        rendererSlices,
        area,
        easing,
        rootSize,
        areCellsMounted,
        picture,
        props.breakpointOpts,
        props.playbackOpts,
    ]);

    useEffect(() => {
        if (!isRunning) return;

        return SliceAnimationUtils.runPasses({
            getProgress: () => progressRef.current,
            setProgress: (value) => latest.current.setProgress(value),
            getCurrentIteration: () => iterationRef.current,
            setCurrentIteration: (value) => latest.current.setCurrentIteration(value),
            getDurationMs: () => latest.current.cycleDurationMs,
            getIterationCount: () => latest.current.iterationCount,
            getIterationDelayMs: () => latest.current.iterationDelayMs,
            onIterationEnd: () => latest.current.props.onIterationEnd?.(),
            onAnimationEnd: () => latest.current.props.onAnimationEnd?.(),
        });
    }, [isRunning]);

    const cells = useMemo(
        () =>
            cellDefs.map((defs, index) => {
                const bounds = CellAnimationUtils.computeCellBounds(columnEdges, rowEdges, defs.pos);

                return (
                    <div
                        key={index}
                        className={CellAnimationStyles.cellAnimationCell}
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
            }),
        [cellDefs, columnEdges, rowEdges],
    );

    const anchorClassName = isSourceRevealed
        ? `${CellAnimationStyles.cellAnimationAnchor} ${CellAnimationStyles.cellAnimationAnchorRevealed}`
        : CellAnimationStyles.cellAnimationAnchor;

    const containerClassName = isRunning
        ? `${CellAnimationStyles.cellAnimationContainer} ${CellAnimationStyles.cellAnimationContainerMoving}`
        : CellAnimationStyles.cellAnimationContainer;

    return (
        <div
            ref={rootRef}
            className={CellAnimationStyles.cellAnimationRoot}
            role={props.ariaLabel ? "img" : undefined}
            aria-label={props.ariaLabel}
            aria-hidden={props.ariaLabel ? undefined : "true"}
        >
            <img
                ref={imgRef}
                src={props.src}
                className={anchorClassName}
                width={sizeAnchor === "width" ? "100%" : "auto"}
                height={sizeAnchor === "height" ? "100%" : "auto"}
                aria-hidden="true"
            />

            {isOnGraphicsCard ? (
                <div
                    key="canvas"
                    className={CellAnimationStyles.cellAnimationContainer}
                    style={{ width: `${rootSize.width}px`, height: `${rootSize.height}px` }}
                >
                    <canvas
                        ref={canvasRef}
                        className={SliceRendererStyles.sliceRendererCanvas}
                        style={{
                            left: `${area.x}px`,
                            top: `${area.y}px`,
                            width: `${shownSize.width}px`,
                            height: `${shownSize.height}px`,
                        }}
                        aria-hidden="true"
                    />
                </div>
            ) : (
                <div
                    key="elements"
                    ref={containerRef}
                    className={containerClassName}
                    style={{
                        ...(assignInlineVars({
                            [CellAnimationStyles.cellSrcVar]: CellAnimationUtils.toSourceImage(props.src),
                            [CellAnimationStyles.cellSizeVar]: `${rootSize.width}px ${rootSize.height}px`,
                        }) as CSSProperties),
                        width: `${rootSize.width}px`,
                        height: `${rootSize.height}px`,
                        perspective: CellAnimationUtils.computePerspective(rootSize),
                    }}
                >
                    {areCellsMounted && cells}
                </div>
            )}
        </div>
    );
};
