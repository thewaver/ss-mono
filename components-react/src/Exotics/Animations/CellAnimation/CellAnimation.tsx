import { type CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { CELL_ANIMATION_DEFAULTS, CellAnimationStyles, CellAnimationUtils } from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../../Utils/refUtils";
import type { CellAnimationProps } from "./CellAnimation.types";

const NO_PROGRESS = 0;
const FIRST_ITERATION = 0;
const NO_WEIGHTS: number[][] = [];

export const CellAnimation = (props: CellAnimationProps) => {
    const durationMs = props.animationDurationMs ?? CELL_ANIMATION_DEFAULTS.animationDurationMs;
    const iterationCount = props.animationIterationCount ?? CELL_ANIMATION_DEFAULTS.animationIterationCount;
    const iterationDelayMs = props.animationIterationDelayMs ?? CELL_ANIMATION_DEFAULTS.animationIterationDelayMs;
    const sizeAnchor = props.sizeAnchor ?? CELL_ANIMATION_DEFAULTS.sizeAnchor;
    const finalFrame = props.finalFrame ?? CELL_ANIMATION_DEFAULTS.finalFrame;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const isPageHidden = InteractionTrackerReactUtils.usePageHidden();

    const [isPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, true);
    const [progress, setProgressState] = SignalMirrorReactUtils.useOptionalState(props.progress, NO_PROGRESS);
    const [currentIteration, setCurrentIterationState] = useState(FIRST_ITERATION);

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

    const latest = useLatest({ props, durationMs, iterationCount, iterationDelayMs, setProgress, setCurrentIteration });

    const cellCount = CellAnimationUtils.computeCellCount(props.cellCount, rootSize);

    const weights = useMemo(
        () => props.computeCellWeights?.(cellCount) ?? NO_WEIGHTS,
        [props.computeCellWeights, cellCount.col, cellCount.row],
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

    const { hasEnded, areCellsMounted, isSourceRevealed } = CellAnimationUtils.computeFrameState(
        currentIteration,
        iterationCount,
        finalFrame,
    );

    const isRunning = isPlaying && !isPageHidden && !hasEnded;

    const drawnSrcRef = useRef(props.src);

    useLayoutEffect(() => {
        if (drawnSrcRef.current === props.src) return;

        drawnSrcRef.current = props.src;
        latest.current.setCurrentIteration(FIRST_ITERATION);
        latest.current.setProgress(NO_PROGRESS);
    }, [props.src]);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const container = containerRef.current;

        if (!root) return;

        const cells =
            container && areCellsMounted
                ? (Array.from(container.querySelectorAll(":scope > div")) as HTMLElement[])
                : [];

        CellAnimationUtils.drawFrame(
            root,
            cells,
            evaluationDefs,
            progress,
            latest.current.props.computeRootAnimation,
            latest.current.props.computeCellAnimation,
        );
    }, [progress, evaluationDefs, areCellsMounted]);

    useEffect(() => {
        if (!isRunning) return;

        return CellAnimationUtils.runPasses({
            getProgress: () => progressRef.current,
            setProgress: (value) => latest.current.setProgress(value),
            getCurrentIteration: () => iterationRef.current,
            setCurrentIteration: (value) => latest.current.setCurrentIteration(value),
            getDurationMs: () => latest.current.durationMs,
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

            <div
                ref={containerRef}
                className={CellAnimationStyles.cellAnimationContainer}
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
        </div>
    );
};
