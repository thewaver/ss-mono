import { computed, defineComponent, shallowRef, useId } from "vue";

import {
    CellAnimationUtils,
    RGBAnimationStyles,
    RGBAnimationUtils,
    RGB_ANIMATION_CHANNELS,
    RGB_ANIMATION_DEFAULTS,
    type SVGColorMixing,
    SVGFilterDefs,
} from "@thewaver/ss-components";
import { RGBAnimationConst } from "@thewaver/ss-components/internal";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps, useTwoWay } from "../../../Utils/propUtils";
import type { RGBAnimationProps } from "./RGBAnimation.types";

export const RGBAnimation = defineComponent(
    (props: RGBAnimationProps) => {
        const getDurationMs = () => props.animationDurationMs ?? RGB_ANIMATION_DEFAULTS.animationDurationMs;
        const getIterationCount = () => props.animationIterationCount ?? RGB_ANIMATION_DEFAULTS.animationIterationCount;
        const getIterationDelayMs = () =>
            props.animationIterationDelayMs ?? RGB_ANIMATION_DEFAULTS.animationIterationDelayMs;

        const filterId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const imgRef = shallowRef<HTMLImageElement>();
        const channelRefs: HTMLElement[] = [];

        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();

        const isPlaying = useTwoWay(props, "playback", true);
        const progress = useTwoWay(props, "progress", RGBAnimationConst.NO_PROGRESS);
        const currentIteration = shallowRef(RGBAnimationConst.FIRST_ITERATION);
        const schemeMixing = shallowRef<SVGColorMixing>(RGBAnimationUtils.readColorMixing(undefined));

        const rootSize = ElementObserverVueUtils.useBorderBoxSize(imgRef);

        const colorMixing = computed(() => props.colorMixing ?? schemeMixing.value);

        const evaluationDefs = computed(() => RGBAnimationUtils.computeEvaluationDefs(rootSize.value));

        const isRunning = computed(
            () => isPlaying.value && !isPageHidden.value && currentIteration.value < getIterationCount(),
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

        watchAfterRender([progress, evaluationDefs], ([currentProgress, defs]) => {
            const root = rootRef.value;

            if (!root) return;

            RGBAnimationUtils.drawFrame(
                root,
                channelRefs,
                defs,
                currentProgress,
                props.computeRootAnimation,
                props.computeChannelAnimation,
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

                    <div
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
            "computeRootAnimation": null,
            "computeChannelAnimation": null,
            "onIterationEnd": null,
            "onAnimationEnd": null,
        }),
    },
);
