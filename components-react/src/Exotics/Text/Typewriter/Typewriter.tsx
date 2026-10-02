import {
    type AnimationEvent,
    type CSSProperties,
    Fragment,
    type ReactNode,
    useEffect,
    useLayoutEffect,
    useReducer,
    useRef,
    useState,
} from "react";

import {
    LetterDriverUtils,
    type LetterState,
    TYPEWRITER_DEFAULTS,
    type TypewriterSegment,
    TypewriterStyles,
    type TypewriterUpdateCause,
    TypewriterUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";

import { LetterDriverContextProvider } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import type { LetterDriverContextType } from "../../../Abstracts/LetterDriver/LetterDriver.context.types";
import { useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { TypewriterController, TypewriterProps } from "./Typewriter.types";

const BEFORE_FIRST = TypewriterUtils.CARET_BEFORE_FIRST;
const CUSTOM_PROPERTY_PREFIX = "--";
const DATA_PREFIX = "data-";

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
    const animationName = props.animationName ?? TYPEWRITER_DEFAULTS.animationName;
    const animationDurationMs = props.animationDurationMs ?? TYPEWRITER_DEFAULTS.animationDurationMs;
    const animationDelayMs = props.animationDelayMs ?? TYPEWRITER_DEFAULTS.animationDelayMs;
    const initialAnimationDelayMs = props.initialAnimationDelayMs ?? TYPEWRITER_DEFAULTS.initialAnimationDelayMs;
    const mode = props.mode ?? TYPEWRITER_DEFAULTS.mode;
    const isErasing = mode === "erase";

    const containerRef = useRef<HTMLDivElement | null>(null);
    const pendingCauseRef = useRef<TypewriterUpdateCause>(undefined);
    const [, requestMeasure] = useReducer((count: number) => count + 1, 0);

    const [registry] = useState(LetterDriverUtils.createRegistry);
    const registryState = useStore(registry);
    const isDriven = registryState.entries.length > 0;

    const latest = useLatest({
        props,
        animationDurationMs,
        animationDelayMs,
        initialAnimationDelayMs,
        isErasing,
        isDriven,
    });

    const [player] = useState(() =>
        TypewriterUtils.createPlayer({
            getContainer: () => containerRef.current ?? undefined,
            getIsDriven: () => latest.current.isDriven,
            getAnimationDurationMs: () => latest.current.animationDurationMs,
            getAnimationDelayMs: () => latest.current.animationDelayMs,
            getInitialAnimationDelayMs: () => latest.current.initialAnimationDelayMs,
            getIsErasing: () => latest.current.isErasing,
            getResetAnimationOnContent: () => latest.current.props.resetAnimationOnContent,
            getResetAnimationOnLayout: () => latest.current.props.resetAnimationOnLayout,
            onAnimationEnd: () => latest.current.props.onAnimationEnd?.(),
        }),
    );

    useEffect(() => () => player.stop(), [player]);

    const state = useStore(player);

    useLayoutEffect(() => {
        const cause = pendingCauseRef.current;

        if (!cause) return;

        pendingCauseRef.current = undefined;
        player.update(cause);
    });

    const [controller] = useState<TypewriterController>(() => ({
        restartAnimation: () => {
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

    const previousRunRef = useRef({ animationName, mode });

    useEffect(() => {
        const previous = previousRunRef.current;

        previousRunRef.current = { animationName, mode };

        if (previous.animationName !== animationName || previous.mode !== mode) player.restart();
    }, [animationName, mode]);

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

    const isErased = !state.isAnimating && isErasing;
    const startTimesMs = TypewriterUtils.computeStartTimes(
        state.count,
        props.computeCharacterWeights?.(state.count),
        isErasing,
        initialAnimationDelayMs,
        animationDelayMs,
    );

    const getAnimationStyle = (startIndex: number): CSSProperties | undefined =>
        state.isAnimating
            ? {
                  animationName,
                  animationDuration: `${animationDurationMs}ms`,
                  animationDelay: `${startTimesMs[startIndex]}ms`,
                  animationDirection: isErasing ? "reverse" : "normal",
              }
            : undefined;

    const handleAnimationStart = (event: AnimationEvent, index: number) => {
        if (event.target !== event.currentTarget) return;

        player.reportCharacterStart(index);
    };

    const renderCaretAfter = (index: number) =>
        state.isAnimating && state.caretIndex === index && props.renderCaret?.();

    const renderSegment = (segment: TypewriterSegment): ReactNode => {
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
                            onAnimationStart={(event) => handleAnimationStart(event, segment.startIndex)}
                        />

                        {renderCaretAfter(segment.startIndex)}
                    </>
                );
            case "linebreak":
                return (
                    <>
                        <br
                            style={getAnimationStyle(segment.startIndex)}
                            onAnimationStart={(event) => handleAnimationStart(event, segment.startIndex)}
                        />

                        {renderCaretAfter(segment.startIndex)}
                    </>
                );
            case "text": {
                const style = toReactStyle({ ...segment.nonMetrics, ...segment.metrics });
                const common = {
                    title: segment.meta?.common.title,
                    ...toDataAttributes(segment.meta?.common.dataset ?? {}),
                };

                if (state.isAnimating) {
                    return (
                        <span style={style}>
                            {Array.from(segment.text).map((character, offset) => (
                                <Fragment key={offset}>
                                    <span
                                        className={TypewriterStyles.typewriterChar}
                                        style={getAnimationStyle(segment.startIndex + offset)}
                                        onAnimationStart={(event) =>
                                            handleAnimationStart(event, segment.startIndex + offset)
                                        }
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

    const getLetterState = (index: number): LetterState => ({
        isHidden: isErased,
        animation: state.isAnimating
            ? {
                  name: animationName,
                  durationMs: animationDurationMs,
                  delayMs: startTimesMs[index],
                  direction: isErasing ? "reverse" : "normal",
              }
            : undefined,
    });

    const driver: LetterDriverContextType = {
        registry,
        getLetterState,
        isAnimating: state.isAnimating,
        isHidden: isErased,
        caretIndex: state.caretIndex,
        renderCaret: props.renderCaret,
        reportLetterStart: player.reportCharacterStart,
    };

    return (
        <LetterDriverContextProvider value={driver}>
            <div className={TypewriterStyles.typewriterRoot}>
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
                        {state.caretIndex === BEFORE_FIRST && props.renderCaret?.()}

                        {state.segments.map((segment, index) => (
                            <Fragment key={index}>{renderSegment(segment)}</Fragment>
                        ))}

                        {!state.isAnimating && state.caretIndex !== BEFORE_FIRST && props.renderCaret?.()}
                    </div>
                )}
            </div>
        </LetterDriverContextProvider>
    );
};
