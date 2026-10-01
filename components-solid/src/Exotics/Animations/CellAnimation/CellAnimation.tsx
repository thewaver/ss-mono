import { For, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import { CELL_ANIMATION_DEFAULTS, CellAnimationUtils, CellAnimationStyles as styles } from "@thewaver/ss-components";
import { type Index2d, Size2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { CellAnimationProps } from "./CellAnimationSolid.types";

const NO_PROGRESS = 0;

export const CellAnimation = (props: CellAnimationProps) => {
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

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getImgRef, setImgRef] = createSignal<HTMLElement>();
    const [getContainerRef, setContainerRef] = createSignal<HTMLElement>();
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(() => props.progress, NO_PROGRESS);
    const [getCellRefs, setCellRefs] = createSignal<HTMLElement[]>([], { equals: false });
    const [getCurrentIteration, setCurrentIteration] = createSignal(0);
    const [getRootSize, setRootSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });

    const getCellCount = createMemo(
        () => CellAnimationUtils.computeCellCount(access(props.cellCount), getRootSize()),
        undefined,
        { equals: CellAnimationUtils.getIsSameCount },
    );

    const getCellWeights = createMemo(() => props.computeCellWeights?.(getCellCount()) ?? []);

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

    const getIsRunning = createMemo(
        () => getIsPlaying() && getIsWindowVisible() && !getHasEnded() && !!getRootRef() && !!getContainerRef(),
    );

    const getEvaluationDefs = createMemo(() =>
        CellAnimationUtils.computeEvaluationDefs(getCellDefs(), getColumnEdges(), getRowEdges()),
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
        const cellDefs = getEvaluationDefs();
        const progress = getProgress();

        if (!rootRef) return;

        untrack(() =>
            CellAnimationUtils.drawFrame(
                rootRef,
                cells,
                cellDefs,
                progress,
                props.computeRootAnimation,
                props.computeCellAnimation,
            ),
        );
    });

    createEffect(() => {
        if (!getIsRunning()) return;

        onCleanup(
            CellAnimationUtils.runPasses({
                getProgress: () => untrack(getProgress),
                setProgress,
                getCurrentIteration: () => untrack(getCurrentIteration),
                setCurrentIteration,
                getDurationMs: getAnimationDurationMs,
                getIterationCount: getAnimationIterationCount,
                getIterationDelayMs: getAnimationIterationDelayMs,
                onIterationEnd: () => props.onIterationEnd?.(),
                onAnimationEnd: () => props.onAnimationEnd?.(),
            }),
        );
    });

    createEffect(() => {
        let resizeObserver: ResizeObserver | undefined;

        onCleanup(() => {
            resizeObserver?.disconnect();
        });

        const imgRef = getImgRef();

        if (!imgRef) return;

        resizeObserver = new ResizeObserver(() => {
            setRootSize({
                width: imgRef.offsetWidth,
                height: imgRef.offsetHeight,
            });
        });
        resizeObserver.observe(imgRef);
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
                src={access(props.src)}
                class={styles.cellAnimationAnchor}
                classList={{ [styles.cellAnimationAnchorRevealed]: getIsSourceRevealed() }}
                width={getSizeAnchor() === "width" ? "100%" : "auto"}
                height={getSizeAnchor() === "height" ? "100%" : "auto"}
                aria-hidden="true"
            />

            <div
                ref={setContainerRef}
                class={styles.cellAnimationContainer}
                style={{
                    ...assignInlineVars({
                        [styles.cellSrcVar]: CellAnimationUtils.toSourceImage(access(props.src)),
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
        </div>
    );
};
