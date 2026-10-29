import { Show, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    CELL_ANIMATION_DEFAULTS,
    CellAnimationBreakpointUtils,
    CellAnimationKeyframeUtils,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlaybackUtils,
    CellAnimationStyles,
    CellAnimationUtils,
    CellAnimationWeights,
    type CellStop,
    ElementObserverUtils,
    RGBAnimationUtils,
    SignalMirrorSolidUtils,
    access,
    useViewportContext,
} from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import type { CellGpuItem } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellGpu/CellGpu.types";
import { CellGpuUtils } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellGpu/CellGpu.utils";
import { MathUtils, Size2d } from "@thewaver/ss-utils";

import type { CellAnimationSourcedExampleProps, GpuCellAnimationProps } from "./CellAnimationPage.types";
import { DefaultExample } from "./Examples/Default";

const NO_PROGRESS = 0;

export const GpuCellAnimation = (props: GpuCellAnimationProps) => {
    const viewportContext = useViewportContext();

    const getSizeAnchor = () => CELL_ANIMATION_DEFAULTS.sizeAnchor;

    const getSettings = createMemo(() => ({
        breakpointOpts: { ...access(props.breakpointOpts) },
        playbackOpts: access(props.playbackOpts) ? { ...access(props.playbackOpts) } : undefined,
        durationMs: access(props.animationDurationMs) ?? CELL_ANIMATION_DEFAULTS.animationDurationMs,
    }));

    const getEasing = createMemo(() => CellGpuUtils.computeEasing(getSettings().breakpointOpts.easing));

    const getCycleDurationMs = createMemo(() =>
        CellAnimationPlaybackUtils.computeCycleDurationMs(getSettings().durationMs, getSettings().playbackOpts),
    );

    const getIterationCount = createMemo(
        () => access(props.animationIterationCount) ?? CELL_ANIMATION_DEFAULTS.animationIterationCount,
    );

    const getIterationDelayMs = createMemo(
        () => access(props.animationIterationDelayMs) ?? CELL_ANIMATION_DEFAULTS.animationIterationDelayMs,
    );

    const getFinalFrame = createMemo(() => access(props.finalFrame) ?? CELL_ANIMATION_DEFAULTS.finalFrame);

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getImgRef, setImgRef] = createSignal<HTMLElement>();
    const [getCanvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();
    const [getItem, setItem] = createSignal<CellGpuItem>();
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(() => props.progress, NO_PROGRESS);
    const [getCurrentIteration, setCurrentIteration] = createSignal(0);
    const [getRootSize, setRootSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });
    const [getSourceVersion, setSourceVersion] = createSignal(0);
    const [getShown, setShown] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });

    const getSource = createMemo(() => access(props.src));

    const getCellCount = createMemo(
        () => CellAnimationUtils.computeCellCount(access(props.cellCount), getRootSize()),
        undefined,
        { equals: CellAnimationUtils.getIsSameCount },
    );

    const getChannelLayout = () => {
        const size = getRootSize();
        const animation = props.animation;
        const tables = RGBAnimationUtils.computeEvaluationDefs(size).map(
            (defs) => CellAnimationKeyframeUtils.resolveStops(animation, RGBAnimationUtils.toSliceDefs(defs)) ?? [],
        );
        const cells = tables.map((_, table) => ({
            left: 0,
            top: 0,
            width: size.width,
            height: size.height,
            weight: 0,
            table,
        }));

        return { cells, tables };
    };

    const getLayout = createMemo(() => {
        if (access(props.isChannels)) return getChannelLayout();

        const size = getRootSize();
        const count = getCellCount();
        const origin = access(props.origin);
        const animation = props.animation;
        const columnEdges = CellAnimationUtils.computeEdges(size.width, count.col);
        const rowEdges = CellAnimationUtils.computeEdges(size.height, count.row);
        const weights = props.computeCellWeights?.(count) ?? [];
        const tableIndices = new Map<CellStop[], number>();

        const cells = CellAnimationUtils.computeCellDefs(count, weights).map((defs) => {
            const bounds = CellAnimationUtils.computeCellBounds(columnEdges, rowEdges, defs.pos);
            const stops =
                CellAnimationKeyframeUtils.resolveStops(animation, {
                    ...defs,
                    size: { width: bounds.width, height: bounds.height },
                    origin,
                }) ?? [];

            if (!tableIndices.has(stops)) tableIndices.set(stops, tableIndices.size);

            return {
                left: bounds.col,
                top: bounds.row,
                width: bounds.width,
                height: bounds.height,
                weight: defs.weight,
                table: tableIndices.get(stops) ?? 0,
            };
        });

        return { cells, tables: [...tableIndices.keys()] };
    });

    const getArea = createMemo(() => {
        const size = getRootSize();
        const { cells, tables } = getLayout();
        const cellSize = {
            width: Math.max(0, ...cells.map((cell) => cell.width)),
            height: Math.max(0, ...cells.map((cell) => cell.height)),
        };
        const reach = CellGpuUtils.computeReach(tables, cellSize, size);

        return { x: -reach, y: -reach, width: size.width + 2 * reach, height: size.height + 2 * reach };
    });

    const getFrameState = createMemo(() =>
        CellAnimationUtils.computeFrameState(getCurrentIteration(), getIterationCount(), getFinalFrame()),
    );

    const getIsRunning = createMemo(
        () => getIsPlaying() && getIsWindowVisible() && !getFrameState().hasEnded && !!getItem(),
    );

    createEffect(
        on(
            getSource,
            () => {
                setCurrentIteration(0);
                setProgress(NO_PROGRESS);
            },
            { defer: true },
        ),
    );

    createEffect(() => {
        const canvasRef = getCanvasRef();

        if (!canvasRef) return;

        const item = CellGpuUtils.createItem(canvasRef, () => setSourceVersion((version) => version + 1), "transfer");

        setItem(item);

        onCleanup(() => {
            item?.dispose();
            setItem(undefined);
        });
    });

    createEffect(() => {
        const item = getItem();
        const rootRef = getRootRef();
        const progress = getProgress();
        const settings = getSettings();
        const layout = getLayout();
        const frame = {
            mode: "slices" as const,
            area: getArea(),
            hasPerspective: true,
            src: getSource(),
            tables: layout.tables,
            cells: layout.cells,
            easing: getEasing(),
            size: getRootSize(),
            isShown: getFrameState().areCellsMounted,
        };

        getSourceVersion();

        if (!item || !rootRef) return;

        untrack(() => {
            const timeline = MathUtils.clamp01(progress);
            const breakpointOpts = CellAnimationPlaybackUtils.computeBreakpointOpts(
                settings.breakpointOpts,
                timeline,
                settings.playbackOpts,
            );

            if (props.computeRootAnimation) {
                CellAnimationUtils.assignAnimationProps(rootRef, props.computeRootAnimation(timeline));
            }

            const scale = window.devicePixelRatio * viewportContext.getScale();

            const presented = item.draw({
                ...frame,
                scale,
                timeline: CellAnimationPlaybackUtils.computeGlobalTimeline(
                    timeline,
                    settings.durationMs,
                    settings.playbackOpts,
                ),
                half: CellAnimationBreakpointUtils.computeBreakpoints(1, { ...breakpointOpts, dir: "asc" })[1],
                isDescending: breakpointOpts.dir === "desc",
                channelMixing: access(props.isChannels)
                    ? (access(props.colorMixing) ?? RGBAnimationUtils.readColorMixing(rootRef))
                    : undefined,
            });

            setShown({ width: presented.width / scale, height: presented.height / scale });
        });
    });

    createEffect(() => {
        if (!getIsRunning()) return;

        onCleanup(
            CellAnimationUtils.runPasses({
                getProgress: () => untrack(getProgress),
                setProgress,
                getCurrentIteration: () => untrack(getCurrentIteration),
                setCurrentIteration,
                getDurationMs: getCycleDurationMs,
                getIterationCount,
                getIterationDelayMs,
                onIterationEnd: () => props.onIterationEnd?.(),
            }),
        );
    });

    createEffect(() => {
        const imgRef = getImgRef();

        if (imgRef) onCleanup(ElementObserverUtils.observeBorderBoxSize(imgRef, setRootSize));
    });

    onMount(() => {
        const handleVisibilityChange = () => setIsWindowVisible(document.visibilityState === "visible");

        document.addEventListener("visibilitychange", handleVisibilityChange);

        onCleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
    });

    return (
        <div ref={setRootRef} class={CellAnimationStyles.cellAnimationRoot} aria-hidden="true">
            <img
                ref={setImgRef}
                src={getSource()}
                class={CellAnimationStyles.cellAnimationAnchor}
                classList={{ [CellAnimationStyles.cellAnimationAnchorRevealed]: getFrameState().isSourceRevealed }}
                width={getSizeAnchor() === "width" ? "100%" : "auto"}
                height={getSizeAnchor() === "height" ? "100%" : "auto"}
                aria-hidden="true"
            />

            <div style={{ width: `${getRootSize().width}px`, height: `${getRootSize().height}px` }} />

            <canvas
                ref={setCanvasRef}
                class={styles.gpuCellsCanvas}
                style={{
                    left: `${getArea().x}px`,
                    top: `${getArea().y}px`,
                    width: `${getShown().width}px`,
                    height: `${getShown().height}px`,
                }}
                aria-hidden="true"
            />
        </div>
    );
};

export const GpuCells = (props: CellAnimationSourcedExampleProps) => {
    const getAnimation = createMemo(() => {
        const animation = CellAnimationKeyframes.SAMPLE_ANIMATIONS[access(props.animationType)];

        return CellAnimationKeyframeUtils.getDefinition(animation) && CellGpuUtils.getIsAvailable()
            ? animation
            : undefined;
    });

    const getOrigin = createMemo(() =>
        CellAnimationOrigins.computeOrigin(access(props.originType), access(props.cellCount)),
    );

    return (
        <Show when={getAnimation()} fallback={<DefaultExample {...props} />}>
            {(getAvailableAnimation) => (
                <GpuCellAnimation
                    src={props.src}
                    cellCount={props.cellCount}
                    origin={getOrigin}
                    breakpointOpts={props.breakpointOpts}
                    playbackOpts={props.playbackOpts}
                    animationDurationMs={props.animationDurationMs}
                    animationIterationCount={props.animationIterationCount}
                    animationIterationDelayMs={props.animationIterationDelayMs}
                    finalFrame={props.finalFrame}
                    playback={props.playback}
                    progress={props.progress}
                    animation={getAvailableAnimation()}
                    computeCellWeights={(count) =>
                        CellAnimationWeights.computeCellWeights(
                            access(props.weightType),
                            count,
                            getOrigin(),
                            access(props.weightOpts),
                        )
                    }
                />
            )}
        </Show>
    );
};
