import {
    For,
    Show,
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    on,
    onCleanup,
    onMount,
    untrack,
} from "solid-js";

import {
    CellAnimationUtils,
    ElementObserverUtils,
    RGBAnimationUtils,
    RGB_ANIMATION_CHANNELS,
    RGB_ANIMATION_DEFAULTS,
    SVGFilterDefs,
    SliceAnimationUtils,
    SliceRendererStyles,
    SliceRendererUtils,
    RGBAnimationStyles as styles,
} from "@thewaver/ss-components";
import { RGBAnimationConst } from "@thewaver/ss-components/internal";
import { MathUtils, Rect, Size2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { SliceRendererSolidUtils } from "../../../Abstracts/SliceRenderer/SliceRendererSolid.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { access } from "../../../Utils/propUtils";
import type { RGBAnimationProps } from "./RGBAnimationSolid.types";

const WHOLE_PASS = { half: 0.5, isDescending: false };
const LINEAR = SliceRendererUtils.computeEasing(undefined);
const NO_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const RGBAnimation = (props: RGBAnimationProps) => {
    const filterId = createUniqueId();

    const viewportContext = useViewportContext();

    const getAnimationDurationMs = createMemo(
        () => access(props.animationDurationMs) ?? RGB_ANIMATION_DEFAULTS.animationDurationMs,
    );

    const getAnimationIterationCount = createMemo(
        () => access(props.animationIterationCount) ?? RGB_ANIMATION_DEFAULTS.animationIterationCount,
    );

    const getAnimationIterationDelayMs = createMemo(
        () => access(props.animationIterationDelayMs) ?? RGB_ANIMATION_DEFAULTS.animationIterationDelayMs,
    );

    const getSizeAnchor = createMemo(() => access(props.sizeAnchor) ?? RGB_ANIMATION_DEFAULTS.sizeAnchor);

    const getAriaLabel = createMemo(() => access(props.ariaLabel));

    const getSource = createMemo(() => access(props.src));

    const getRenderer = createMemo(() => access(props.renderer) ?? RGB_ANIMATION_DEFAULTS.renderer);

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getImgRef, setImgRef] = createSignal<HTMLElement>();
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(
        () => props.progress,
        RGBAnimationConst.NO_PROGRESS,
    );
    const [getCurrentIteration, setCurrentIteration] = createSignal(RGBAnimationConst.FIRST_ITERATION);
    const [getRootSize, setRootSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });
    const [getChannelRefs, setChannelRefs] = createSignal<HTMLElement[]>([], { equals: false });
    const [getIsMounted, setIsMounted] = createSignal(false);
    const [getCanvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();
    const [getShownRect, setShownRect] = createSignal<Rect>(NO_RECT, { equals: Rect.isSame });

    const getHasEnded = createMemo(() => getCurrentIteration() >= getAnimationIterationCount());

    const getIsRunning = createMemo(
        () =>
            getIsPlaying() &&
            getIsWindowVisible() &&
            !getHasEnded() &&
            !!getRootRef() &&
            (!getIsOnGraphicsCard() || !!getItem()),
    );

    const getSchemeMixing = createMemo(
        on([getCurrentIteration, getIsMounted], ([, isMounted]) =>
            RGBAnimationUtils.readColorMixing(isMounted ? getRootRef() : undefined),
        ),
    );

    const getColorMixing = createMemo(() => access(props.colorMixing) ?? getSchemeMixing());

    const getEvaluationDefs = createMemo(() => RGBAnimationUtils.computeEvaluationDefs(getRootSize()));

    const getIsElementsOnly = createMemo(() => getRenderer() === "elements");

    const getIsAvailable = SliceRendererSolidUtils.createIsAvailable(getIsElementsOnly);

    const getPicture = SliceRendererSolidUtils.createPicture(getSource, getIsElementsOnly);

    const getTables = createMemo(() =>
        getIsElementsOnly()
            ? undefined
            : SliceAnimationUtils.resolveTables(
                  props.computeSliceAnimation,
                  getEvaluationDefs().map(RGBAnimationUtils.toSliceDefs),
              ),
    );

    const getIsOnGraphicsCard = createMemo(
        () => getIsAvailable() && SliceRendererUtils.getCanDraw(getRenderer(), getPicture()) && !!getTables(),
    );

    const getItem = SliceRendererSolidUtils.createItem(getCanvasRef, getIsAvailable);

    const getRendererSlices = createMemo(() => {
        const size = getRootSize();

        return (getTables()?.tableIndices ?? []).map((table) => ({
            left: 0,
            top: 0,
            width: size.width,
            height: size.height,
            weight: 0,
            table,
        }));
    });

    const getArea = createMemo(() => {
        const size = getRootSize();
        const reach = SliceRendererUtils.computeReach(getTables()?.tables ?? [], size, size);

        return { x: -reach, y: -reach, width: size.width + 2 * reach, height: size.height + 2 * reach };
    });

    createEffect(
        on(
            getSource,
            () => {
                setCurrentIteration(RGBAnimationConst.FIRST_ITERATION);
                setProgress(RGBAnimationConst.NO_PROGRESS);
            },
            { defer: true },
        ),
    );

    createEffect(() => {
        const rootRef = getRootRef();
        const channels = getChannelRefs();
        const defs = getEvaluationDefs();
        const progress = getProgress();
        const isOnGraphicsCard = getIsOnGraphicsCard();

        if (!rootRef || isOnGraphicsCard) return;

        untrack(() =>
            RGBAnimationUtils.drawFrame(
                rootRef,
                channels,
                defs,
                progress,
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
        const tables = getTables()?.tables ?? [];
        const slices = getRendererSlices();
        const area = getArea();
        const size = getRootSize();
        const channelMixing = getColorMixing();

        getPicture();

        if (!rootRef || !item || !isOnGraphicsCard) return;

        untrack(() => {
            const timeline = MathUtils.clamp01(progress);

            if (props.computeRootAnimation) {
                SliceAnimationUtils.assignAnimationProps(rootRef, props.computeRootAnimation(timeline));
            }

            const scale = window.devicePixelRatio * viewportContext.getScale();
            item.draw(
                {
                    mode: "slices",
                    src: getSource(),
                    tables,
                    easing: LINEAR,
                    slices,
                    size,
                    area,
                    scale,
                    timeline,
                    half: WHOLE_PASS.half,
                    isDescending: WHOLE_PASS.isDescending,
                    isShown: true,
                    hasPerspective: true,
                    channelMixing,
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
                getDurationMs: getAnimationDurationMs,
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
        setIsMounted(true);

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
            class={styles.rgbAnimationRoot}
            role={getAriaLabel() ? "img" : undefined}
            aria-label={getAriaLabel()}
            aria-hidden={getAriaLabel() ? undefined : "true"}
        >
            <img
                ref={setImgRef}
                src={getSource()}
                class={styles.rgbAnimationAnchor}
                width={getSizeAnchor() === "width" ? "100%" : "auto"}
                height={getSizeAnchor() === "height" ? "100%" : "auto"}
                aria-hidden="true"
            />

            <svg class={styles.rgbAnimationFilterHost} aria-hidden="true">
                <defs>
                    <For each={RGB_ANIMATION_CHANNELS}>
                        {(channel) => (
                            <filter id={`${filterId}-${channel}`}>
                                <feColorMatrix
                                    type="matrix"
                                    values={RGBAnimationUtils.computeChannelMatrix(channel, getColorMixing())}
                                    color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                                />
                            </filter>
                        )}
                    </For>
                </defs>
            </svg>

            <Show
                when={getIsOnGraphicsCard()}
                fallback={
                    <div
                        class={styles.rgbAnimationContainer}
                        style={{
                            ...assignInlineVars({
                                [styles.channelSrcVar]: CellAnimationUtils.toSourceImage(getSource()),
                            }),
                            width: `${getRootSize().width}px`,
                            height: `${getRootSize().height}px`,
                            perspective: CellAnimationUtils.computePerspective(getRootSize()),
                        }}
                    >
                        <For each={RGB_ANIMATION_CHANNELS}>
                            {(channel, getIndex) => (
                                <div
                                    ref={(el) => {
                                        const refs = untrack(getChannelRefs);

                                        refs[getIndex()] = el;
                                        setChannelRefs(refs);
                                    }}
                                    class={styles.rgbAnimationChannel}
                                    style={{ "mix-blend-mode": RGBAnimationUtils.getBlendMode(getColorMixing()) }}
                                    aria-hidden="true"
                                >
                                    <div
                                        class={styles.rgbAnimationChannelPicture}
                                        style={{ filter: `url(#${filterId}-${channel})` }}
                                    />
                                </div>
                            )}
                        </For>
                    </div>
                }
            >
                <div
                    class={styles.rgbAnimationContainer}
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
