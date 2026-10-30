import { For, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    CELL_ANIMATION_DEFAULTS,
    CellAnimationUtils,
    ElementObserverUtils,
    SliceAnimationUtils,
    SliceRendererStyles,
    SliceRendererUtils,
    CellAnimationStyles as styles,
} from "@thewaver/ss-components";
import { CellAnimationConst } from "@thewaver/ss-components/internal";
import { type Index2d, MathUtils, Rect, Size2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { SliceRendererSolidUtils } from "../../../Abstracts/SliceRenderer/SliceRendererSolid.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { access } from "../../../Utils/propUtils";
import type { CellAnimationProps } from "./CellAnimationSolid.types";

const NO_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const CellAnimation = (props: CellAnimationProps) => {
    const viewportContext = useViewportContext();

    const getAnimationDurationMs = createMemo(
        () => access(props.animationDurationMs) ?? CELL_ANIMATION_DEFAULTS.animationDurationMs,
    );

    const getAnimationIterationCount = createMemo(
        () => access(props.animationIterationCount) ?? CELL_ANIMATION_DEFAULTS.animationIterationCount,
    );

    const getAnimationIterationDelayMs = createMemo(
        () => access(props.animationIterationDelayMs) ?? CELL_ANIMATION_DEFAULTS.animationIterationDelayMs,
    );

    const getSizeAnchor = createMemo(() => access(props.sizeAnchor) ?? CELL_ANIMATION_DEFAULTS.sizeAnchor);

    const getAriaLabel = createMemo(() => access(props.ariaLabel));

    const getOrigin = createMemo(() => access(props.origin) ?? CELL_ANIMATION_DEFAULTS.origin);

    const getBreakpointOpts = createMemo(() => access(props.breakpointOpts));

    const getPlaybackOpts = createMemo(() => access(props.playbackOpts));

    const getRenderer = createMemo(() => access(props.renderer) ?? CELL_ANIMATION_DEFAULTS.renderer);

    const getCycleDurationMs = createMemo(() =>
        SliceAnimationUtils.computeCycleDurationMs(getAnimationDurationMs(), getPlaybackOpts()),
    );

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getImgRef, setImgRef] = createSignal<HTMLElement>();
    const [getContainerRef, setContainerRef] = createSignal<HTMLElement>();
    const [getCanvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(
        () => props.progress,
        CellAnimationConst.NO_PROGRESS,
    );
    const [getCellRefs, setCellRefs] = createSignal<HTMLElement[]>([], { equals: false });
    const [getCurrentIteration, setCurrentIteration] = createSignal(0);
    const [getRootSize, setRootSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });
    const [getShownRect, setShownRect] = createSignal<Rect>(NO_RECT, { equals: Rect.isSame });

    const getCellCount = createMemo(
        () => CellAnimationUtils.computeCellCount(access(props.cellCount), getRootSize()),
        undefined,
        { equals: CellAnimationUtils.getIsSameCount },
    );

    const getCellWeights = createMemo(() => props.computeSliceWeights?.(getCellCount()) ?? []);

    const getColumnEdges = createMemo(() => CellAnimationUtils.computeEdges(getRootSize().width, getCellCount().col));

    const getRowEdges = createMemo(() => CellAnimationUtils.computeEdges(getRootSize().height, getCellCount().row));

    const getCellBounds = (pos: Index2d) => CellAnimationUtils.computeCellBounds(getColumnEdges(), getRowEdges(), pos);

    const getCellDefs = createMemo(() => CellAnimationUtils.computeCellDefs(getCellCount(), getCellWeights()));

    const getSource = createMemo(() => access(props.src));

    const getFinalFrame = createMemo(() => access(props.finalFrame) ?? CELL_ANIMATION_DEFAULTS.finalFrame);

    const getFrameState = createMemo(() =>
        CellAnimationUtils.computeFrameState(getCurrentIteration(), getAnimationIterationCount(), getFinalFrame()),
    );

    const getHasEnded = createMemo(() => getFrameState().hasEnded);

    const getAreCellsMounted = createMemo(() => getFrameState().areCellsMounted);

    const getIsSourceRevealed = createMemo(() => getFrameState().isSourceRevealed);

    const getEvaluationDefs = createMemo(() =>
        CellAnimationUtils.computeEvaluationDefs(getCellDefs(), getColumnEdges(), getRowEdges()),
    );

    const getSlices = createMemo(() => SliceAnimationUtils.withOrigin(getEvaluationDefs(), getOrigin()));

    const getIsElementsOnly = createMemo(() => getRenderer() === "elements");

    const getIsAvailable = SliceRendererSolidUtils.createIsAvailable(getIsElementsOnly);

    const getPicture = SliceRendererSolidUtils.createPicture(getSource, getIsElementsOnly);

    const getTables = createMemo(() =>
        getIsElementsOnly() ? undefined : SliceAnimationUtils.resolveTables(props.computeSliceAnimation, getSlices()),
    );

    const getIsOnGraphicsCard = createMemo(
        () => getIsAvailable() && SliceRendererUtils.getCanDraw(getRenderer(), getPicture()) && !!getTables(),
    );

    const getItem = SliceRendererSolidUtils.createItem(getCanvasRef, getIsAvailable);

    const getEasing = createMemo(() => SliceRendererUtils.computeEasing(getBreakpointOpts()?.easing));

    const getRendererSlices = createMemo(() => {
        const tableIndices = getTables()?.tableIndices ?? [];

        return getCellDefs().map((defs, idx) => {
            const bounds = getCellBounds(defs.pos);

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

    const getArea = createMemo(() => {
        const size = getRootSize();
        const largest = getEvaluationDefs().reduce(
            (most, defs) => ({
                width: Math.max(most.width, defs.size.width),
                height: Math.max(most.height, defs.size.height),
            }),
            { width: 0, height: 0 },
        );
        const reach = SliceRendererUtils.computeReach(getTables()?.tables ?? [], largest, size);

        return { x: -reach, y: -reach, width: size.width + 2 * reach, height: size.height + 2 * reach };
    });

    const getIsRunning = createMemo(
        () =>
            getIsPlaying() &&
            getIsWindowVisible() &&
            !getHasEnded() &&
            !!getRootRef() &&
            (getIsOnGraphicsCard() ? !!getItem() : !!getContainerRef()),
    );

    createEffect(
        on(
            getSource,
            () => {
                setCurrentIteration(0);
                setProgress(CellAnimationConst.NO_PROGRESS);
            },
            { defer: true },
        ),
    );

    createEffect(() => {
        const containerRef = getContainerRef();

        getEvaluationDefs();

        setCellRefs(
            containerRef && getAreCellsMounted()
                ? (Array.from(containerRef.querySelectorAll(":scope > div")) as HTMLElement[])
                : [],
        );
    });

    createEffect(() => {
        const rootRef = getRootRef();
        const cells = getCellRefs();
        const slices = getSlices();
        const progress = getProgress();
        const isOnGraphicsCard = getIsOnGraphicsCard();
        const timing = SliceAnimationUtils.computeTiming(
            progress,
            getAnimationDurationMs(),
            getBreakpointOpts(),
            getPlaybackOpts(),
        );

        if (!rootRef || isOnGraphicsCard) return;

        untrack(() =>
            CellAnimationUtils.drawFrame(
                rootRef,
                cells,
                slices,
                progress,
                timing,
                props.computeRootAnimation,
                props.computeSliceAnimation,
            ),
        );
    });

    createEffect(() => {
        const rootRef = getRootRef();
        const item = getItem();
        const progress = getProgress();
        const isOnGraphicsCard = getIsOnGraphicsCard();
        const timing = SliceAnimationUtils.computeTiming(
            progress,
            getAnimationDurationMs(),
            getBreakpointOpts(),
            getPlaybackOpts(),
        );
        const tables = getTables()?.tables ?? [];
        const slices = getRendererSlices();
        const area = getArea();
        const easing = getEasing();
        const size = getRootSize();
        const isShown = getAreCellsMounted();

        getPicture();

        if (!rootRef || !item || !isOnGraphicsCard) return;

        untrack(() => {
            if (props.computeRootAnimation) {
                SliceAnimationUtils.assignAnimationProps(
                    rootRef,
                    props.computeRootAnimation(MathUtils.clamp01(progress)),
                );
            }

            const scale = window.devicePixelRatio * viewportContext.getScale();
            const sliceWindow = SliceAnimationUtils.computeWindow(timing);
            item.draw(
                {
                    mode: "slices",
                    src: getSource(),
                    tables,
                    easing,
                    slices,
                    size,
                    area,
                    scale,
                    timeline: timing.globalTimeline,
                    half: sliceWindow.half,
                    isDescending: sliceWindow.isDescending,
                    isShown,
                    hasPerspective: true,
                },
                setShownRect,
            );
        });
    });

    createEffect(() => {
        if (!getIsRunning()) return;

        onCleanup(
            SliceAnimationUtils.runPasses({
                getProgress: () => untrack(getProgress),
                setProgress,
                getCurrentIteration: () => untrack(getCurrentIteration),
                setCurrentIteration,
                getDurationMs: getCycleDurationMs,
                getIterationCount: getAnimationIterationCount,
                getIterationDelayMs: getAnimationIterationDelayMs,
                onIterationEnd: () => props.onIterationEnd?.(),
                onAnimationEnd: () => props.onAnimationEnd?.(),
            }),
        );
    });

    createEffect(() => {
        const imgRef = getImgRef();

        if (imgRef) onCleanup(ElementObserverUtils.observeBorderBoxSize(imgRef, setRootSize));
    });

    onMount(() => {
        const handleVisibilityChange = () => {
            setIsWindowVisible(document.visibilityState === "visible");
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        onCleanup(() => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        });
    });

    return (
        <div
            ref={setRootRef}
            class={styles.cellAnimationRoot}
            role={getAriaLabel() ? "img" : undefined}
            aria-label={getAriaLabel()}
            aria-hidden={getAriaLabel() ? undefined : "true"}
        >
            <img
                ref={setImgRef}
                src={getSource()}
                class={styles.cellAnimationAnchor}
                classList={{ [styles.cellAnimationAnchorRevealed]: getIsSourceRevealed() }}
                width={getSizeAnchor() === "width" ? "100%" : "auto"}
                height={getSizeAnchor() === "height" ? "100%" : "auto"}
                aria-hidden="true"
            />

            <Show
                when={getIsOnGraphicsCard()}
                fallback={
                    <div
                        ref={setContainerRef}
                        class={styles.cellAnimationContainer}
                        classList={{ [styles.cellAnimationContainerMoving]: getIsRunning() }}
                        style={{
                            ...assignInlineVars({
                                [styles.cellSrcVar]: CellAnimationUtils.toSourceImage(getSource()),
                                [styles.cellSizeVar]: `${getRootSize().width}px ${getRootSize().height}px`,
                            }),
                            width: `${getRootSize().width}px`,
                            height: `${getRootSize().height}px`,
                            perspective: CellAnimationUtils.computePerspective(getRootSize()),
                        }}
                    >
                        <Show when={getAreCellsMounted()}>
                            <For each={getCellDefs()}>
                                {(defs) => {
                                    const getBounds = createMemo(() => getCellBounds(defs.pos));

                                    return (
                                        <div
                                            class={styles.cellAnimationCell}
                                            style={{
                                                "left": `${getBounds().col}px`,
                                                "top": `${getBounds().row}px`,
                                                "width": `${getBounds().width}px`,
                                                "height": `${getBounds().height}px`,
                                                "background-position": `${-getBounds().col}px ${-getBounds().row}px`,
                                                "z-index": `${CellAnimationUtils.computeCellDepth(defs.weight)}`,
                                            }}
                                            aria-hidden="true"
                                        />
                                    );
                                }}
                            </For>
                        </Show>
                    </div>
                }
            >
                <div
                    class={styles.cellAnimationContainer}
                    style={{ width: `${getRootSize().width}px`, height: `${getRootSize().height}px` }}
                >
                    <canvas
                        ref={setCanvasRef}
                        class={SliceRendererStyles.sliceRendererCanvas}
                        style={{
                            left: `${getShownRect().x}px`,
                            top: `${getShownRect().y}px`,
                            width: `${getShownRect().width}px`,
                            height: `${getShownRect().height}px`,
                        }}
                        aria-hidden="true"
                    />
                </div>
            </Show>
        </div>
    );
};
