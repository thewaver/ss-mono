import { type CSSProperties, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

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
import { MathUtils, Size2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { SliceRendererReactUtils } from "../../../Abstracts/SliceRenderer/SliceRendererReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { useLatest } from "../../../Utils/refUtils";
import type { RGBAnimationProps } from "./RGBAnimation.types";

const WHOLE_PASS = { half: 0.5, isDescending: false };
const LINEAR = SliceRendererUtils.computeEasing(undefined);

export const RGBAnimation = (props: RGBAnimationProps) => {
    const durationMs = props.animationDurationMs ?? RGB_ANIMATION_DEFAULTS.animationDurationMs;
    const iterationCount = props.animationIterationCount ?? RGB_ANIMATION_DEFAULTS.animationIterationCount;
    const iterationDelayMs = props.animationIterationDelayMs ?? RGB_ANIMATION_DEFAULTS.animationIterationDelayMs;
    const sizeAnchor = props.sizeAnchor ?? RGB_ANIMATION_DEFAULTS.sizeAnchor;
    const renderer = props.renderer ?? RGB_ANIMATION_DEFAULTS.renderer;

    const filterId = useId();

    const viewportContext = useViewportContext();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const channelRefs = useRef<HTMLElement[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    const latest = useLatest({ props, durationMs, iterationCount, iterationDelayMs, setProgress, setCurrentIteration });

    const colorMixing = props.colorMixing ?? schemeMixing;
    const blendMode = RGBAnimationUtils.getBlendMode(colorMixing);

    const evaluationDefs = useMemo(
        () => RGBAnimationUtils.computeEvaluationDefs(rootSize),
        [rootSize.width, rootSize.height],
    );

    const isElementsOnly = renderer === "elements";

    const isAvailable = SliceRendererReactUtils.useIsAvailable(isElementsOnly);

    const picture = SliceRendererReactUtils.usePicture(props.src, isElementsOnly);

    const tables = useMemo(
        () =>
            isElementsOnly
                ? undefined
                : SliceAnimationUtils.resolveTables(
                      props.computeSliceAnimation,
                      evaluationDefs.map(RGBAnimationUtils.toSliceDefs),
                  ),
        [isElementsOnly, props.computeSliceAnimation, evaluationDefs],
    );

    const isOnGraphicsCard = isAvailable && SliceRendererUtils.getCanDraw(renderer, picture) && !!tables;

    const item = SliceRendererReactUtils.useItem(canvasRef, isAvailable);

    const rendererSlices = useMemo(
        () =>
            (tables?.tableIndices ?? []).map((table) => ({
                left: 0,
                top: 0,
                width: rootSize.width,
                height: rootSize.height,
                weight: 0,
                table,
            })),
        [tables, rootSize],
    );

    const area = useMemo(() => {
        const reach = SliceRendererUtils.computeReach(tables?.tables ?? [], rootSize, rootSize);

        return { x: -reach, y: -reach, width: rootSize.width + 2 * reach, height: rootSize.height + 2 * reach };
    }, [tables, rootSize]);

    const hasEnded = currentIteration >= iterationCount;

    const isRunning = isPlaying && !isPageHidden && !hasEnded && (!isOnGraphicsCard || !!item);

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

        if (!root || isOnGraphicsCard) return;

        RGBAnimationUtils.drawFrame(
            root,
            channelRefs.current,
            evaluationDefs,
            progress,
            latest.current.props.computeRootAnimation,
            latest.current.props.computeSliceAnimation,
        );
    }, [progress, evaluationDefs, isOnGraphicsCard]);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root || !item || !isOnGraphicsCard) return;

        const current = latest.current;
        const timeline = MathUtils.clamp01(progress);

        if (current.props.computeRootAnimation) {
            SliceAnimationUtils.assignAnimationProps(root, current.props.computeRootAnimation(timeline));
        }

        const scale = window.devicePixelRatio * viewportContext.getScale();
        const shown = item.draw({
            mode: "slices",
            src: current.props.src,
            tables: tables?.tables ?? [],
            easing: LINEAR,
            slices: rendererSlices,
            size: rootSize,
            area,
            scale,
            timeline,
            half: WHOLE_PASS.half,
            isDescending: WHOLE_PASS.isDescending,
            isShown: true,
            hasPerspective: true,
            channelMixing: colorMixing,
        });
        const next = { width: shown.width / scale, height: shown.height / scale };

        setShownSize((previous) => (Size2d.isSame(previous, next) ? previous : next));
    }, [item, progress, isOnGraphicsCard, tables, rendererSlices, area, rootSize, colorMixing, picture]);

    useEffect(() => {
        if (!isRunning) return;

        return SliceAnimationUtils.runPasses({
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

            {isOnGraphicsCard ? (
                <div
                    key="canvas"
                    className={RGBAnimationStyles.rgbAnimationContainer}
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
            )}
        </div>
    );
};
