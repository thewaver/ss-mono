import {
    type CSSProperties,
    Fragment,
    type ReactNode,
    useEffect,
    useLayoutEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";

import {
    LetterDriverStyles,
    LetterDriverUtils,
    type LetterSegment,
    type LetterState,
    TYPEWRITER_DEFAULTS,
    TypewriterStyles,
    type TypewriterUpdateCause,
    TypewriterUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { LetterDriverContextProvider } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import type { LetterDriverContextType } from "../../../Abstracts/LetterDriver/LetterDriver.context.types";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest, useStableList } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { TypewriterController, TypewriterProps } from "./Typewriter.types";

const BEFORE_FIRST = TypewriterUtils.CARET_BEFORE_FIRST;
const CUSTOM_PROPERTY_PREFIX = "--";
const DATA_PREFIX = "data-";
const NO_PROGRESS = 0;

const toReactStyle = (style: Record<string, unknown>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [
            key.startsWith(CUSTOM_PROPERTY_PREFIX) ? key : StringUtils.kebabToCamelCase(key),
            value,
        ]),
    ) as CSSProperties;

const toDataAttributes = (dataset: DOMStringMap) =>
    Object.fromEntries(
        Object.entries(dataset).map(([key, value]) => [`${DATA_PREFIX}${StringUtils.camelToKebabCase(key)}`, value]),
    );

const joinClasses = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(" ");

export const Typewriter = (props: TypewriterProps) => {
    const computeAnimationName = props.computeAnimationName ?? TYPEWRITER_DEFAULTS.computeAnimationName;
    const animationDurationMs = props.animationDurationMs ?? TYPEWRITER_DEFAULTS.animationDurationMs;
    const animationDelayMs = props.animationDelayMs ?? TYPEWRITER_DEFAULTS.animationDelayMs;
    const initialAnimationDelayMs = props.initialAnimationDelayMs ?? TYPEWRITER_DEFAULTS.initialAnimationDelayMs;
    const mode = props.mode ?? TYPEWRITER_DEFAULTS.mode;
    const isErasing = mode === "erase";

    const [progress, setProgressState] = SignalMirrorReactUtils.useOptionalState(props.progress, NO_PROGRESS);
    const [isPlaying, setIsPlayingState] = SignalMirrorReactUtils.useOptionalState(props.playback, true);

    const progressRef = useLatest(progress);
    const isPlayingRef = useLatest(isPlaying);

    const setProgress = (value: number) => {
        progressRef.current = value;
        setProgressState(value);
    };

    const setIsPlaying = (value: boolean) => {
        isPlayingRef.current = value;
        setIsPlayingState(value);
    };

    const containerRef = useRef<HTMLDivElement | null>(null);
    const pendingCauseRef = useRef<TypewriterUpdateCause>(undefined);
    const [, requestMeasure] = useReducer((count: number) => count + 1, 0);

    const [registry] = useState(LetterDriverUtils.createRegistry);
    const registryState = useStore(registry);
    const isDriven = registryState.entries.length > 0;

    const latest = useLatest({ props, computeAnimationName, isDriven, setProgress, setIsPlaying });

    const [player] = useState(() =>
        TypewriterUtils.createPlayer({
            getContainer: () => containerRef.current ?? undefined,
            getIsDriven: () => latest.current.isDriven,
            getComputeAnimationName: () => latest.current.computeAnimationName,
            getIsPlaying: () => isPlayingRef.current,
            setProgress: (value) => latest.current.setProgress(value),
            getResetAnimationOnContent: () => latest.current.props.resetAnimationOnContent,
            getResetAnimationOnLayout: () => latest.current.props.resetAnimationOnLayout,
        }),
    );

    const state = useStore(player);

    const runDurationMs = TypewriterUtils.getRunDurationMs(
        state.count,
        animationDelayMs,
        initialAnimationDelayMs,
        animationDurationMs,
    );

    const runDurationMsRef = useLatest(runDurationMs);

    const timeMs = progress * runDurationMs;
    const isAnimating = TypewriterUtils.getIsRunning(state.count, progress, isPlaying);
    const isErased = !isAnimating && isErasing;

    useLayoutEffect(() => {
        const cause = pendingCauseRef.current;

        if (!cause) return;

        pendingCauseRef.current = undefined;
        player.update(cause);
    });

    const [controller] = useState<TypewriterController>(() => ({
        restartAnimation: () => {
            latest.current.setIsPlaying(true);
            player.restart();

            return true;
        },
        update: (cause) => {
            if (!containerRef.current) return false;

            pendingCauseRef.current = cause;
            requestMeasure();

            return true;
        },
    }));

    const characters = useMemo(
        () => (isDriven ? registryState.characters : LetterDriverUtils.getCharacters(state.segments)),
        [isDriven, registryState.characters, state.segments],
    );

    const animationNames = useStableList(
        characters.map((character, index) => computeAnimationName(character, index, characters.length)),
    );

    const namedRef = useRef({ characters, animationNames });

    useEffect(() => {
        const named = namedRef.current;

        namedRef.current = { characters, animationNames };

        if (named.characters === characters && named.animationNames !== animationNames) player.restart();
    }, [animationNames]);

    const previousModeRef = useRef(mode);

    useEffect(() => {
        if (previousModeRef.current === mode) return;

        previousModeRef.current = mode;
        player.restart();
    }, [mode]);

    useEffect(() => {
        props.onMount?.(controller);

        const container = containerRef.current;

        return container ? player.observe(container) : undefined;
    }, [controller]);

    const previousDrivenCountRef = useRef(0);

    useEffect(() => {
        if (!isDriven) return;

        const count = registryState.characters.length;

        player.setCount(count, previousDrivenCountRef.current ? "content" : "other");
        previousDrivenCountRef.current = count;
    }, [registryState.characters, isDriven]);

    const isWalking = isPlaying && isAnimating;

    useEffect(() => {
        if (!isWalking) return;

        return TypewriterUtils.run({
            getProgress: () => progressRef.current,
            setProgress: (value) => latest.current.setProgress(value),
            getRunDurationMs: () => runDurationMsRef.current,
            onEnd: () => latest.current.props.onAnimationEnd?.(),
        });
    }, [isWalking]);

    const startTimesMs = TypewriterUtils.computeStartTimes(
        state.count,
        props.computeCharacterWeights?.(state.count),
        isErasing,
        initialAnimationDelayMs,
        animationDelayMs,
    );

    const caretIndex = TypewriterUtils.computeCaretIndex(startTimesMs, timeMs, isErasing, !isAnimating);

    const getLetterAnimation = (index: number) => ({
        name: animationNames[index],
        durationMs: animationDurationMs,
        delayMs: startTimesMs[index],
        direction: isErasing ? ("reverse" as const) : ("normal" as const),
    });

    const getAnimationStyle = (index: number): CSSProperties | undefined =>
        isAnimating
            ? toReactStyle(
                  LetterDriverUtils.computeAnimationStyle(
                      getLetterAnimation(index),
                      LetterDriverStyles.letterDriverTimeVar,
                  ),
              )
            : undefined;

    const rootStyle = assignInlineVars({
        [LetterDriverStyles.letterDriverTimeVar]: LetterDriverUtils.getTimeValue(timeMs),
    }) as CSSProperties;

    const renderCaretAfter = (index: number) => isAnimating && caretIndex === index && props.renderCaret?.();

    const renderSegment = (segment: LetterSegment): ReactNode => {
        switch (segment.type) {
            case "atomic":
                return (
                    <>
                        <span
                            ref={(node) => {
                                if (node && node.firstChild !== segment.element) {
                                    node.replaceChildren(segment.element);
                                }
                            }}
                            className={joinClasses(
                                segment.isBlockLike
                                    ? TypewriterStyles.typewriterBlockLikeAtomic
                                    : TypewriterStyles.typewriterChar,
                                isErased && TypewriterStyles.typewriterErased,
                            )}
                            style={getAnimationStyle(segment.startIndex)}
                        />

                        {renderCaretAfter(segment.startIndex)}
                    </>
                );
            case "linebreak":
                return LetterDriverUtils.getIsAnimated(segment) ? (
                    <>
                        <br style={getAnimationStyle(segment.startIndex)} />

                        {renderCaretAfter(segment.startIndex)}
                    </>
                ) : (
                    <br />
                );
            case "text": {
                const style = toReactStyle({ ...segment.nonMetrics, ...segment.metrics });
                const common = {
                    title: segment.meta?.common.title,
                    ...toDataAttributes(segment.meta?.common.dataset ?? {}),
                };

                if (isAnimating) {
                    return (
                        <span style={style}>
                            {Array.from(segment.text).map((character, offset) => (
                                <Fragment key={offset}>
                                    <span
                                        className={TypewriterStyles.typewriterChar}
                                        style={getAnimationStyle(segment.startIndex + offset)}
                                    >
                                        {character}
                                    </span>

                                    {renderCaretAfter(segment.startIndex + offset)}
                                </Fragment>
                            ))}
                        </span>
                    );
                }

                const className = joinClasses(
                    TypewriterStyles.typewriterChar,
                    isErased && TypewriterStyles.typewriterErased,
                );

                return segment.meta?.anchor ? (
                    <a className={className} style={style} {...common} {...segment.meta.anchor}>
                        {segment.text}
                    </a>
                ) : (
                    <span className={className} style={style} {...common}>
                        {segment.text}
                    </span>
                );
            }
        }
    };

    const getLetterState = (index: number): LetterState =>
        isAnimating ? { isHidden: false, animation: getLetterAnimation(index) } : { isHidden: isErased };

    const driver: LetterDriverContextType = {
        registry,
        getLetterState,
        isAnimating,
        isHidden: isErased,
        caretIndex,
        renderCaret: props.renderCaret,
    };

    return (
        <LetterDriverContextProvider value={driver}>
            <div className={TypewriterStyles.typewriterRoot} style={rootStyle}>
                <div
                    ref={containerRef}
                    className={isDriven ? undefined : TypewriterStyles.typewriterChildrenWrap}
                    aria-hidden={isDriven ? undefined : "true"}
                    inert={!isDriven}
                >
                    {props.children}
                </div>

                {!isDriven && state.segments.length > 0 && (
                    <div className={TypewriterStyles.typewriterTextWrap} style={{ width: `${state.width ?? 0}px` }}>
                        {caretIndex === BEFORE_FIRST && props.renderCaret?.()}

                        {state.segments.map((segment, index) => (
                            <Fragment key={index}>{renderSegment(segment)}</Fragment>
                        ))}

                        {!isAnimating && caretIndex !== BEFORE_FIRST && props.renderCaret?.()}
                    </div>
                )}
            </div>
        </LetterDriverContextProvider>
    );
};
