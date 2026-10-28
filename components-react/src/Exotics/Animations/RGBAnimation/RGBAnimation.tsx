import { type CSSProperties, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

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

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../../Utils/refUtils";
import type { RGBAnimationProps } from "./RGBAnimation.types";

export const RGBAnimation = (props: RGBAnimationProps) => {
    const durationMs = props.animationDurationMs ?? RGB_ANIMATION_DEFAULTS.animationDurationMs;
    const iterationCount = props.animationIterationCount ?? RGB_ANIMATION_DEFAULTS.animationIterationCount;
    const iterationDelayMs = props.animationIterationDelayMs ?? RGB_ANIMATION_DEFAULTS.animationIterationDelayMs;
    const sizeAnchor = props.sizeAnchor ?? RGB_ANIMATION_DEFAULTS.sizeAnchor;

    const filterId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const channelRefs = useRef<HTMLElement[]>([]);

    const isPageHidden = InteractionTrackerReactUtils.usePageHidden();

    const [isPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, true);
    const [progress, setProgressState] = SignalMirrorReactUtils.useOptionalState(
        props.progress,
        RGBAnimationConst.NO_PROGRESS,
    );
    const [currentIteration, setCurrentIterationState] = useState(RGBAnimationConst.FIRST_ITERATION);
    const [schemeMixing, setSchemeMixing] = useState<SVGColorMixing>(() =>
        RGBAnimationUtils.readColorMixing(undefined),
    );

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

    const colorMixing = props.colorMixing ?? schemeMixing;
    const blendMode = RGBAnimationUtils.getBlendMode(colorMixing);

    const evaluationDefs = useMemo(
        () => RGBAnimationUtils.computeEvaluationDefs(rootSize),
        [rootSize.width, rootSize.height],
    );

    const hasEnded = currentIteration >= iterationCount;

    const isRunning = isPlaying && !isPageHidden && !hasEnded;

    const drawnSrcRef = useRef(props.src);

    useLayoutEffect(() => {
        setSchemeMixing(RGBAnimationUtils.readColorMixing(rootRef.current ?? undefined));
    }, [currentIteration]);

    useLayoutEffect(() => {
        if (drawnSrcRef.current === props.src) return;

        drawnSrcRef.current = props.src;
        latest.current.setCurrentIteration(RGBAnimationConst.FIRST_ITERATION);
        latest.current.setProgress(RGBAnimationConst.NO_PROGRESS);
    }, [props.src]);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root) return;

        RGBAnimationUtils.drawFrame(
            root,
            channelRefs.current,
            evaluationDefs,
            progress,
            latest.current.props.computeRootAnimation,
            latest.current.props.computeChannelAnimation,
        );
    }, [progress, evaluationDefs]);

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

    return (
        <div
            ref={rootRef}
            className={RGBAnimationStyles.rgbAnimationRoot}
            role={props.ariaLabel ? "img" : undefined}
            aria-label={props.ariaLabel}
            aria-hidden={props.ariaLabel ? undefined : "true"}
        >
            <img
                ref={imgRef}
                src={props.src}
                className={RGBAnimationStyles.rgbAnimationAnchor}
                width={sizeAnchor === "width" ? "100%" : "auto"}
                height={sizeAnchor === "height" ? "100%" : "auto"}
                aria-hidden="true"
            />

            <svg className={RGBAnimationStyles.rgbAnimationFilterHost} aria-hidden="true">
                <defs>
                    {RGB_ANIMATION_CHANNELS.map((channel) => (
                        <filter key={channel} id={`${filterId}-${channel}`}>
                            <feColorMatrix
                                type="matrix"
                                values={RGBAnimationUtils.computeChannelMatrix(channel, colorMixing)}
                                colorInterpolationFilters={SVGFilterDefs.COLOR_SPACE}
                            />
                        </filter>
                    ))}
                </defs>
            </svg>

            <div
                className={RGBAnimationStyles.rgbAnimationContainer}
                style={{
                    ...(assignInlineVars({
                        [RGBAnimationStyles.channelSrcVar]: CellAnimationUtils.toSourceImage(props.src),
                    }) as CSSProperties),
                    width: `${rootSize.width}px`,
                    height: `${rootSize.height}px`,
                    perspective: CellAnimationUtils.computePerspective(rootSize),
                }}
            >
                {RGB_ANIMATION_CHANNELS.map((channel, index) => (
                    <div
                        key={channel}
                        ref={(el) => {
                            if (el) channelRefs.current[index] = el;
                        }}
                        className={RGBAnimationStyles.rgbAnimationChannel}
                        style={{ mixBlendMode: blendMode }}
                        aria-hidden="true"
                    >
                        <div
                            className={RGBAnimationStyles.rgbAnimationChannelPicture}
                            style={{ filter: `url(#${filterId}-${channel})` }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
