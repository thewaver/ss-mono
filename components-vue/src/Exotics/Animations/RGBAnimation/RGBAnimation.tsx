import { computed, defineComponent, shallowRef, useId } from "vue";

import {
    CellAnimationUtils,
    RGBAnimationStyles,
    RGBAnimationUtils,
    RGB_ANIMATION_CHANNELS,
    RGB_ANIMATION_DEFAULTS,
    type SVGColorMixing,
    SVGFilterDefs,
    SliceAnimationUtils,
    SliceRendererStyles,
    SliceRendererUtils,
} from "@thewaver/ss-components";
import { RGBAnimationConst } from "@thewaver/ss-components/internal";
import { MathUtils, Rect } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { SliceRendererVueUtils } from "../../../Abstracts/SliceRenderer/SliceRendererVue.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps, useTwoWay } from "../../../Utils/propUtils";
import type { RGBAnimationProps } from "./RGBAnimation.types";

const WHOLE_PASS = { half: 0.5, isDescending: false };
const LINEAR = SliceRendererUtils.computeEasing(undefined);
const NO_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const RGBAnimation = defineComponent(
    (props: RGBAnimationProps) => {
        const viewportContext = useViewportContext();

        const getDurationMs = () => props.animationDurationMs ?? RGB_ANIMATION_DEFAULTS.animationDurationMs;
        const getIterationCount = () => props.animationIterationCount ?? RGB_ANIMATION_DEFAULTS.animationIterationCount;
        const getIterationDelayMs = () =>
            props.animationIterationDelayMs ?? RGB_ANIMATION_DEFAULTS.animationIterationDelayMs;

        const filterId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const imgRef = shallowRef<HTMLImageElement>();
        const canvasRef = shallowRef<HTMLCanvasElement>();
        const channelRefs: HTMLElement[] = [];

        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();

        const isPlaying = useTwoWay(props, "playback", true);
        const progress = useTwoWay(props, "progress", RGBAnimationConst.NO_PROGRESS);
        const currentIteration = shallowRef(RGBAnimationConst.FIRST_ITERATION);
        const schemeMixing = shallowRef<SVGColorMixing>(RGBAnimationUtils.readColorMixing(undefined));
        const shownRect = shallowRef<Rect>(NO_RECT);

        const rootSize = ElementObserverVueUtils.useBorderBoxSize(imgRef);

        const colorMixing = computed(() => props.colorMixing ?? schemeMixing.value);

        const evaluationDefs = computed(() => RGBAnimationUtils.computeEvaluationDefs(rootSize.value));

        const renderer = computed(() => props.renderer ?? RGB_ANIMATION_DEFAULTS.renderer);

        const isElementsOnly = computed(() => renderer.value === "elements");

        const isAvailable = SliceRendererVueUtils.useIsAvailable(isElementsOnly);

        const picture = SliceRendererVueUtils.usePicture(() => props.src, isElementsOnly);

        const tables = computed(() =>
            isElementsOnly.value
                ? undefined
                : SliceAnimationUtils.resolveTables(
                      props.computeSliceAnimation,
                      evaluationDefs.value.map(RGBAnimationUtils.toSliceDefs),
                  ),
        );

        const isOnGraphicsCard = computed(
            () => isAvailable.value && SliceRendererUtils.getCanDraw(renderer.value, picture.value) && !!tables.value,
        );

        const item = SliceRendererVueUtils.useItem(canvasRef, isAvailable);

        const rendererSlices = computed(() => {
            const size = rootSize.value;

            return (tables.value?.tableIndices ?? []).map((table) => ({
                left: 0,
                top: 0,
                width: size.width,
                height: size.height,
                weight: 0,
                table,
            }));
        });

        const area = computed(() => {
            const size = rootSize.value;
            const reach = SliceRendererUtils.computeReach(tables.value?.tables ?? [], size, size);

            return { x: -reach, y: -reach, width: size.width + 2 * reach, height: size.height + 2 * reach };
        });

        const isRunning = computed(
            () =>
                isPlaying.value &&
                !isPageHidden.value &&
                currentIteration.value < getIterationCount() &&
                !!rootRef.value &&
                (!isOnGraphicsCard.value || !!item.value),
        );

        let drawnSrc = props.src;

        watchAfterRender([currentIteration], () => {
            schemeMixing.value = RGBAnimationUtils.readColorMixing(rootRef.value);
        });

        watchAfterRender([() => props.src], ([src]) => {
            if (drawnSrc === src) return;

            drawnSrc = src;
            currentIteration.value = RGBAnimationConst.FIRST_ITERATION;
            progress.value = RGBAnimationConst.NO_PROGRESS;
        });

        watchAfterRender([progress, evaluationDefs, isOnGraphicsCard], ([currentProgress, defs, isOnCard]) => {
            const root = rootRef.value;

            if (!root || isOnCard) return;

            RGBAnimationUtils.drawFrame(
                root,
                channelRefs,
                defs,
                currentProgress,
                props.computeRootAnimation,
                props.computeSliceAnimation,
            );
        });

        watchAfterRender(
            [item, progress, tables, rendererSlices, area, rootSize, colorMixing, isOnGraphicsCard, picture],
            ([currentItem, currentProgress, currentTables, slices, currentArea, size, channelMixing, isOnCard]) => {
                const root = rootRef.value;

                if (!root || !currentItem || !isOnCard) return;

                const timeline = MathUtils.clamp01(currentProgress);

                if (props.computeRootAnimation) {
                    SliceAnimationUtils.assignAnimationProps(root, props.computeRootAnimation(timeline));
                }

                const scale = window.devicePixelRatio * viewportContext.getScale();
                currentItem.draw(
                    {
                        mode: "slices",
                        src: props.src,
                        tables: currentTables?.tables ?? [],
                        easing: LINEAR,
                        slices,
                        size,
                        area: currentArea,
                        scale,
                        timeline,
                        half: WHOLE_PASS.half,
                        isDescending: WHOLE_PASS.isDescending,
                        isShown: true,
                        hasPerspective: true,
                        channelMixing,
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
                getDurationMs,
                getIterationCount,
                getIterationDelayMs,
                onIterationEnd: () => props.onIterationEnd?.(),
                onAnimationEnd: () => props.onAnimationEnd?.(),
            });
        });

        return () => {
            const sizeAnchor = props.sizeAnchor ?? RGB_ANIMATION_DEFAULTS.sizeAnchor;
            const size = rootSize.value;
            const blendMode = RGBAnimationUtils.getBlendMode(colorMixing.value);

            return (
                <div
                    ref={rootRef}
                    class={RGBAnimationStyles.rgbAnimationRoot}
                    role={props.ariaLabel ? "img" : undefined}
                    aria-label={props.ariaLabel}
                    aria-hidden={props.ariaLabel ? undefined : "true"}
                >
                    <img
                        ref={imgRef}
                        src={props.src}
                        class={RGBAnimationStyles.rgbAnimationAnchor}
                        width={sizeAnchor === "width" ? "100%" : "auto"}
                        height={sizeAnchor === "height" ? "100%" : "auto"}
                        aria-hidden="true"
                    />

                    <svg class={RGBAnimationStyles.rgbAnimationFilterHost} aria-hidden="true">
                        <defs>
                            {RGB_ANIMATION_CHANNELS.map((channel) => (
                                <filter key={channel} id={`${filterId}-${channel}`}>
                                    <feColorMatrix
                                        type="matrix"
                                        values={RGBAnimationUtils.computeChannelMatrix(channel, colorMixing.value)}
                                        color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                                    />
                                </filter>
                            ))}
                        </defs>
                    </svg>

                    {isOnGraphicsCard.value ? (
                        <div
                            key="canvas"
                            class={RGBAnimationStyles.rgbAnimationContainer}
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
                            key="channels"
                            class={RGBAnimationStyles.rgbAnimationContainer}
                            style={{
                                ...assignInlineVars({
                                    [RGBAnimationStyles.channelSrcVar]: CellAnimationUtils.toSourceImage(props.src),
                                }),
                                width: `${size.width}px`,
                                height: `${size.height}px`,
                                perspective: CellAnimationUtils.computePerspective(size),
                            }}
                        >
                            {RGB_ANIMATION_CHANNELS.map((channel, index) => (
                                <div
                                    key={channel}
                                    ref={(el) => {
                                        if (el) channelRefs[index] = el as HTMLElement;
                                    }}
                                    class={RGBAnimationStyles.rgbAnimationChannel}
                                    style={{ mixBlendMode: blendMode }}
                                    aria-hidden="true"
                                >
                                    <div
                                        class={RGBAnimationStyles.rgbAnimationChannelPicture}
                                        style={{ filter: `url(#${filterId}-${channel})` }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        };
    },
    {
        name: "RGBAnimation",
        props: declareProps<RGBAnimationProps>({
            "src": null,
            "ariaLabel": null,
            "sizeAnchor": null,
            "colorMixing": null,
            "animationDurationMs": null,
            "animationIterationCount": null,
            "animationIterationDelayMs": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "progress": null,
            "onUpdate:progress": null,
            "renderer": null,
            "computeRootAnimation": null,
            "computeSliceAnimation": null,
            "onIterationEnd": null,
            "onAnimationEnd": null,
        }),
    },
);
