import {
    type CSSProperties,
    Fragment,
    type SVGProps,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";

import {
    LetterDriverStyles,
    LetterDriverUtils,
    type LetterRegistration,
    PAINTED_TEXT_DEFAULTS,
    type PaintedTextLetter,
    type PaintedTextRun,
    PaintedTextStyles,
    PaintedTextUtils,
    ShapeLayerUtils,
    TrailUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";

import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { useLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import type { SVGDefs } from "../../../Generators/SVGDefs/SVGDefs.types";
import { PaintAreaContextProvider } from "../../../Generators/SVGDefs/SVGGradients/PaintArea.context";
import { useElement, useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { PaintedTextController, PaintedTextProps } from "./PaintedText.types";

const MASK_PADDING_SIDES = 2;
const NO_OFFSET = 0;
const NO_LENGTH = 0;
const NO_PROGRESS = 0;
const NO_REGISTRY = LetterDriverUtils.createRegistry();

type LayerAttributes = SVGProps<SVGTextElement> & SVGProps<SVGGElement>;

const toReactStyle = (style: Record<string, unknown>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]),
    ) as CSSProperties;

const renderDefsElements = (defs: SVGDefs[]) =>
    defs.map((def, index) => (
        <Fragment key={index}>
            {def.gradientOrPattern?.renderDefsElement()}
            {def.filter?.renderDefsElement()}
            {def.clipPath?.renderDefsElement()}
        </Fragment>
    ));

const renderRun = (run: PaintedTextRun, index: number, isReadable: boolean, isOnPath: boolean) => (
    <tspan
        key={index}
        x={isOnPath ? undefined : run.x}
        y={isOnPath ? undefined : run.y}
        style={toReactStyle(run.style)}
    >
        {isReadable && run.title && <title>{run.title}</title>}
        {isReadable && run.anchor ? (
            <a href={run.anchor.href} target={run.anchor.target} rel={run.anchor.rel}>
                {run.text}
            </a>
        ) : (
            run.text
        )}
    </tspan>
);

export const PaintedText = (props: PaintedTextProps) => {
    const maskId = `painted-text-mask-${useId()}`;
    const pathId = `painted-text-path-${useId()}`;

    const driver = useLetterDriverContext();

    const [progress, setProgressState] = SignalMirrorReactUtils.useOptionalState(props.progress, NO_PROGRESS);
    const [isPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, PAINTED_TEXT_DEFAULTS.playback);

    const isPageHidden = InteractionTrackerReactUtils.usePageHidden();

    const isOnPath = props.path !== undefined;
    const isFittedToPath = props.isFittedToPath ?? PAINTED_TEXT_DEFAULTS.isFittedToPath;
    const lapDurationMs = props.lapDurationMs ?? PAINTED_TEXT_DEFAULTS.lapDurationMs;

    const pathRef = useLatest({ path: props.path, isFittedToPath });
    const progressRef = useLatest(progress);

    const rootRef = useRef<HTMLDivElement>(null);
    const rootElement = useElement(rootRef);
    const sourceRef = useRef<HTMLDivElement>(null);
    const layoutRef = useRef<HTMLDivElement>(null);
    const registrationRef = useRef<LetterRegistration>(undefined);
    const isDrivenRef = useRef(!!driver);

    isDrivenRef.current = !!driver;

    const computePushingName = driver?.computePushingAnimationName;
    const computePushingNameRef = useRef<((character: string, index: number) => string) | undefined>(undefined);

    computePushingNameRef.current =
        computePushingName && driver
            ? (character, index) =>
                  computePushingName(
                      character,
                      (rootRef.current ? driver.registry.getOffset(rootRef.current) : NO_OFFSET) + index,
                      driver.registry.get().characters.length,
                  )
            : undefined;

    const [layout] = useState(() =>
        PaintedTextUtils.createLayout({
            getSource: () => sourceRef.current ?? undefined,
            getLayoutHost: () => layoutRef.current ?? undefined,
            getIsMeasuringLetters: () => isDrivenRef.current,
            getComputePushingAnimationName: () => computePushingNameRef.current,
            getPath: () => pathRef.current.path,
            getIsFittedToPath: () => pathRef.current.isFittedToPath,
        }),
    );

    const runs = useStore(layout, (state) => state.runs);
    const atomics = useStore(layout, (state) => state.atomics);
    const letters = useStore(layout, (state) => state.letters);
    const restLetters = useStore(layout, (state) => state.restLetters);
    const width = useStore(layout, (state) => state.width ?? 0);
    const height = useStore(layout, (state) => state.height);
    const origin = useStore(layout, (state) => state.origin);
    const pathLength = useStore(layout, (state) => state.pathLength);
    const ascent = useStore(layout, (state) => state.ascent);
    const descent = useStore(layout, (state) => state.descent);

    const startOffset = progress * pathLength;
    const isSliding = isOnPath && isPlaying && !isPageHidden && pathLength > NO_LENGTH;

    const setProgress = (value: number) => {
        progressRef.current = value;
        setProgressState(value);
    };

    const latest = useLatest({ lapDurationMs, setProgress });

    useStore(driver?.registry ?? NO_REGISTRY, (state) => state.entries);

    const isUpdatePendingRef = useRef(false);
    const [, requestMeasure] = useReducer((count: number) => count + 1, 0);

    useLayoutEffect(() => {
        if (!isUpdatePendingRef.current) return;

        isUpdatePendingRef.current = false;
        layout.update();
    });

    const [controller] = useState<PaintedTextController>(() => ({
        update: () => {
            if (!sourceRef.current) return false;

            isUpdatePendingRef.current = true;
            requestMeasure();

            return true;
        },
    }));

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!driver || !root) return;

        const registration = driver.registry.register(root);

        registrationRef.current = registration;

        return () => {
            registrationRef.current = undefined;
            registration.unregister();
        };
    }, [driver?.registry]);

    useLayoutEffect(() => {
        const source = sourceRef.current;

        if (!source) return undefined;

        layout.update();

        return layout.observe(source);
    }, [layout]);

    useEffect(() => {
        registrationRef.current?.setCharacters(letters.map((letter) => letter.character));
    }, [letters]);

    useEffect(() => {
        registrationRef.current?.setBoxes(
            restLetters.map((letter) => ({
                x: letter.x - origin.x,
                y: letter.top - origin.y,
                width: letter.width,
                height: letter.height,
            })),
        );
    }, [restLetters, origin]);

    const isFirstPathRef = useRef(true);

    useLayoutEffect(() => {
        if (isFirstPathRef.current) {
            isFirstPathRef.current = false;

            return;
        }

        layout.update();
    }, [props.path, isFittedToPath]);

    useLayoutEffect(() => {
        layout.placeAlongPath(startOffset);
    }, [startOffset]);

    useEffect(() => {
        if (!isSliding) return;

        return TrailUtils.run({
            getProgress: () => progressRef.current,
            setProgress: (value) => latest.current.setProgress(value),
            getRunDurationMs: () => latest.current.lapDurationMs,
            getIsLooping: () => true,
            onEnd: () => undefined,
        });
    }, [isSliding]);

    useEffect(() => {
        props.onMount?.(controller);
    }, [controller]);

    const size = { width, height };
    const paintAreaContext = useMemo(
        () => ({ paintArea: { x: origin.x, y: origin.y, width, height } }),
        [origin, width, height],
    );
    const strokePaint = PaintedTextUtils.computeStrokePaint(
        props.strokeAlignment ?? PAINTED_TEXT_DEFAULTS.strokeAlignment,
        props.strokeWidth ?? PAINTED_TEXT_DEFAULTS.strokeWidth,
    );
    const strokeDefs = props.computeStrokeDefs?.(size, rootElement) ?? [];
    const fillDefs = PaintedTextUtils.resolveFillDefs(props.computeFillDefs?.(size, rootElement), strokeDefs);
    const maskPadding = strokePaint.drawnWidth;

    const offset = driver && rootRef.current ? driver.registry.getOffset(rootRef.current) : NO_OFFSET;
    const isPerLetter = !!driver?.isAnimating;

    const pushingStyles = computePushingName
        ? restLetters.map((_, index) => {
              const animation = driver?.getLetterState(offset + index).animation;

              return animation
                  ? LetterDriverUtils.computeAnimationStyle(animation, LetterDriverStyles.letterDriverTimeVar)
                  : undefined;
          })
        : undefined;
    const pushingKey = pushingStyles && JSON.stringify(pushingStyles);

    useLayoutEffect(() => {
        if (pushingStyles) layout.relayout(pushingStyles);
    }, [restLetters, pushingKey]);

    const getLetterStyle = (localIndex: number) =>
        driver && isPerLetter
            ? PaintedTextUtils.computeLetterStyle(
                  driver.getLetterState(offset + localIndex),
                  LetterDriverStyles.letterDriverTimeVar,
              )
            : undefined;

    const atomicLetterIndices = letters.reduce<number[]>((indices, letter, index) => {
        if (letter.atomicIndex !== undefined) indices[letter.atomicIndex] = index;

        return indices;
    }, []);

    const caretBox =
        driver?.renderCaret && driver.caretIndex !== undefined
            ? PaintedTextUtils.computeCaretBox(
                  letters,
                  driver.caretIndex,
                  offset,
                  isOnPath ? { ascent, descent } : undefined,
              )
            : undefined;

    const renderRuns = (isReadable: boolean) => runs.map((run, index) => renderRun(run, index, isReadable, isOnPath));

    const renderLetter = (letter: PaintedTextLetter, localIndex: number) => {
        const state = driver?.getLetterState(offset + localIndex);
        const letterStyle = getLetterStyle(localIndex);

        return (
            <text
                key={localIndex}
                className={PaintedTextStyles.paintedTextLayer}
                x={state?.glyph ? letter.x + letter.width * 0.5 : letter.x}
                y={letter.baseline}
                textAnchor={state?.glyph ? "middle" : undefined}
                style={toReactStyle({ ...runs[letter.runIndex ?? 0]?.style, ...letterStyle })}
            >
                {state?.glyph ?? letter.character}
            </text>
        );
    };

    const renderLetters = () => letters.map((letter, index) => letter.kind === "text" && renderLetter(letter, index));

    const renderPathLetter = (letter: PaintedTextLetter, localIndex: number) => {
        const placement = letter.placement;

        if (!placement) return undefined;

        const state = driver?.getLetterState(offset + localIndex);
        const letterStyle = getLetterStyle(localIndex);

        return (
            <g
                key={localIndex}
                transform={`translate(${placement.point.x} ${placement.point.y}) rotate(${placement.angle})`}
            >
                <text
                    className={PaintedTextStyles.paintedTextLayer}
                    x={state?.glyph ? 0 : -placement.advance * 0.5}
                    y={0}
                    textAnchor={state?.glyph ? "middle" : undefined}
                    style={toReactStyle({ ...runs[letter.runIndex ?? 0]?.style, ...letterStyle })}
                >
                    {state?.glyph ?? letter.character}
                </text>
            </g>
        );
    };

    const renderPathText = (key: string, attributes: LayerAttributes, isReadable: boolean, textOffset: number) => (
        <text
            key={key}
            className={PaintedTextStyles.paintedTextLayer}
            {...(attributes as SVGProps<SVGTextElement>)}
            textLength={isFittedToPath ? pathLength : undefined}
            lengthAdjust={isFittedToPath ? "spacing" : undefined}
            aria-hidden={isReadable ? undefined : "true"}
        >
            <textPath href={`#${pathId}`} startOffset={textOffset}>
                {renderRuns(isReadable)}
            </textPath>
        </text>
    );

    const renderLayer = (key: string, attributes: LayerAttributes, isReadable: boolean) =>
        isPerLetter ? (
            <g key={key} {...(attributes as SVGProps<SVGGElement>)} aria-hidden="true">
                {isOnPath ? letters.map(renderPathLetter) : renderLetters()}
            </g>
        ) : isOnPath ? (
            renderPathText(key, attributes, isReadable, startOffset)
        ) : (
            <text
                key={key}
                className={PaintedTextStyles.paintedTextLayer}
                {...(attributes as SVGProps<SVGTextElement>)}
                aria-hidden={isReadable ? undefined : "true"}
            >
                {renderRuns(isReadable)}
            </text>
        );

    return (
        <div
            ref={rootRef}
            className={PaintedTextStyles.paintedTextRoot}
            style={isOnPath ? { width: `${width}px`, height: `${height}px` } : undefined}
        >
            <div ref={sourceRef} className={PaintedTextStyles.paintedTextSourceWrap} aria-hidden="true" inert>
                {props.children}
            </div>

            <div
                ref={layoutRef}
                className={[
                    PaintedTextStyles.paintedTextLayoutWrap,
                    isOnPath ? PaintedTextStyles.paintedTextLayoutWrapOnPath : undefined,
                ]
                    .filter(Boolean)
                    .join(" ")}
                aria-hidden="true"
                inert
            />

            <svg
                className={PaintedTextStyles.paintedTextSVG}
                width={width}
                height={height}
                viewBox={`${origin.x} ${origin.y} ${width} ${height}`}
                style={driver?.isHidden ? { visibility: "hidden" } : undefined}
            >
                <defs>
                    <PaintAreaContextProvider value={paintAreaContext}>
                        {renderDefsElements(fillDefs)}
                        {renderDefsElements(strokeDefs)}
                    </PaintAreaContextProvider>

                    {isOnPath && <path id={pathId} d={PaintedTextUtils.computeLapPath(props.path!)} />}

                    {strokePaint.maskKind && (
                        <mask
                            id={maskId}
                            maskUnits="userSpaceOnUse"
                            x={origin.x - maskPadding}
                            y={origin.y - maskPadding}
                            width={width + maskPadding * MASK_PADDING_SIDES}
                            height={height + maskPadding * MASK_PADDING_SIDES}
                        >
                            {strokePaint.maskKind === "outside" && (
                                <rect
                                    x={origin.x - maskPadding}
                                    y={origin.y - maskPadding}
                                    width={width + maskPadding * MASK_PADDING_SIDES}
                                    height={height + maskPadding * MASK_PADDING_SIDES}
                                    fill="white"
                                />
                            )}

                            {renderLayer(
                                "mask",
                                { fill: strokePaint.maskKind === "outside" ? "black" : "white" },
                                false,
                            )}
                        </mask>
                    )}
                </defs>

                {isPerLetter &&
                    (isOnPath ? (
                        renderPathText("readable", { opacity: 0 }, true, startOffset)
                    ) : (
                        <text className={PaintedTextStyles.paintedTextLayer} opacity={0}>
                            {renderRuns(true)}
                        </text>
                    ))}

                {fillDefs.map((def, index) => {
                    const paint = ShapeLayerUtils.computePaint(def);

                    return renderLayer(
                        `fill-${index}`,
                        {
                            fill: paint.fill,
                            fillOpacity: paint.fillOpacity,
                            filter: paint.filter,
                            clipPath: paint.clipPath,
                            style: paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined,
                        },
                        PaintedTextUtils.getIsReadableLayer("fill", index, fillDefs.length),
                    );
                })}

                {strokeDefs.map((def, index) => {
                    const paint = ShapeLayerUtils.computePaint(def);

                    return renderLayer(
                        `stroke-${index}`,
                        {
                            fill: "none",
                            stroke: paint.fill,
                            strokeOpacity: paint.fillOpacity,
                            strokeWidth: strokePaint.drawnWidth,
                            strokeLinejoin: "round",
                            mask: strokePaint.maskKind ? `url(#${maskId})` : undefined,
                            filter: paint.filter,
                            clipPath: paint.clipPath,
                            style: paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined,
                        },
                        PaintedTextUtils.getIsReadableLayer("stroke", index, fillDefs.length),
                    );
                })}

                {atomics.map((node, index) => {
                    const letterStyle = getLetterStyle(atomicLetterIndices[index]);

                    return (
                        <g
                            key={index}
                            style={letterStyle && toReactStyle(letterStyle)}
                            ref={(group) => {
                                if (group && group.firstChild !== node) group.replaceChildren(node);
                            }}
                        />
                    );
                })}
            </svg>

            {caretBox && (
                <div
                    key={`${caretBox.x}-${caretBox.top}`}
                    className={PaintedTextStyles.paintedTextCaret}
                    style={toReactStyle(PaintedTextUtils.computeCaretStyle(caretBox, origin))}
                >
                    {driver?.renderCaret?.()}
                </div>
            )}
        </div>
    );
};
