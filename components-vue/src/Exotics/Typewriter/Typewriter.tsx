import {
    type CSSProperties,
    Fragment,
    type SlotsType,
    type VNodeChild,
    defineComponent,
    nextTick,
    onScopeDispose,
    shallowRef,
} from "vue";

import {
    TYPEWRITER_DEFAULTS,
    type TypewriterSegment,
    TypewriterStyles,
    TypewriterUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";

import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps } from "../../Utils/propUtils";
import { useStore } from "../../Utils/storeUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { TypewriterController, TypewriterProps, TypewriterSlots } from "./Typewriter.types";

const BEFORE_FIRST = TypewriterUtils.CARET_BEFORE_FIRST;
const CUSTOM_PROPERTY_PREFIX = "--";
const DATA_PREFIX = "data-";

const toVueStyle = (style: Record<string, unknown>) =>
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

export const Typewriter = defineComponent(
    (props: TypewriterProps, { slots }: SlotsContext<TypewriterSlots>) => {
        const getAnimationName = () => props.animationName ?? TYPEWRITER_DEFAULTS.animationName;
        const getAnimationDurationMs = () => props.animationDurationMs ?? TYPEWRITER_DEFAULTS.animationDurationMs;
        const getAnimationDelayMs = () => props.animationDelayMs ?? TYPEWRITER_DEFAULTS.animationDelayMs;
        const getInitialAnimationDelayMs = () =>
            props.initialAnimationDelayMs ?? TYPEWRITER_DEFAULTS.initialAnimationDelayMs;
        const getMode = () => props.mode ?? TYPEWRITER_DEFAULTS.mode;
        const getIsErasing = () => getMode() === "erase";

        const containerRef = shallowRef<HTMLDivElement>();

        const player = TypewriterUtils.createPlayer({
            getContainer: () => containerRef.value,
            getAnimationDurationMs,
            getAnimationDelayMs,
            getInitialAnimationDelayMs,
            getIsErasing,
            getResetAnimationOnContent: () => props.resetAnimationOnContent,
            getResetAnimationOnLayout: () => props.resetAnimationOnLayout,
            onAnimationEnd: () => props.onAnimationEnd?.(),
        });

        onScopeDispose(() => player.stop());

        const state = useStore(player);

        const controller: TypewriterController = {
            restartAnimation: () => {
                player.restart();

                return true;
            },
            update: (cause) => {
                if (!containerRef.value) return false;

                void nextTick(() => player.update(cause));

                return true;
            },
        };

        let previousRun = { animationName: getAnimationName(), mode: getMode() };

        watchAfterRender([getAnimationName, getMode], ([animationName, mode]) => {
            const previous = previousRun;

            previousRun = { animationName, mode };

            if (previous.animationName !== animationName || previous.mode !== mode) player.restart();
        });

        watchAfterRender([], () => {
            props.onMount?.(controller);

            const container = containerRef.value;

            return container ? player.observe(container) : undefined;
        });

        return () => {
            const current = state.value;
            const isErasing = getIsErasing();
            const isErased = !current.isAnimating && isErasing;
            const startTimesMs = TypewriterUtils.computeStartTimes(
                current.count,
                props.computeCharacterWeights?.(current.count),
                isErasing,
                getInitialAnimationDelayMs(),
                getAnimationDelayMs(),
            );

            const getAnimationStyle = (startIndex: number): CSSProperties | undefined =>
                current.isAnimating
                    ? {
                          animationName: getAnimationName(),
                          animationDuration: `${getAnimationDurationMs()}ms`,
                          animationDelay: `${startTimesMs[startIndex]}ms`,
                          animationDirection: isErasing ? "reverse" : "normal",
                      }
                    : undefined;

            const handleAnimationStart = (event: AnimationEvent, index: number) => {
                if (event.target !== event.currentTarget) return;

                player.reportCharacterStart(index);
            };

            const renderCaret = () => callSlot(slots.renderCaret, undefined);

            const renderCaretAfter = (index: number) =>
                current.isAnimating && current.caretIndex === index && renderCaret();

            const renderSegment = (segment: TypewriterSegment): VNodeChild => {
                switch (segment.type) {
                    case "atomic":
                        return (
                            <>
                                <span
                                    ref={(node) => {
                                        if (node instanceof HTMLElement && node.firstChild !== segment.element) {
                                            node.replaceChildren(segment.element);
                                        }
                                    }}
                                    class={[
                                        segment.isBlockLike
                                            ? TypewriterStyles.typewriterBlockLikeAtomic
                                            : TypewriterStyles.typewriterChar,
                                        isErased && TypewriterStyles.typewriterErased,
                                    ]}
                                    style={getAnimationStyle(segment.startIndex)}
                                    onAnimationstart={(event) => handleAnimationStart(event, segment.startIndex)}
                                />

                                {renderCaretAfter(segment.startIndex)}
                            </>
                        );
                    case "linebreak":
                        return (
                            <>
                                <br
                                    style={getAnimationStyle(segment.startIndex)}
                                    onAnimationstart={(event) => handleAnimationStart(event, segment.startIndex)}
                                />

                                {renderCaretAfter(segment.startIndex)}
                            </>
                        );
                    case "text": {
                        const style = toVueStyle({ ...segment.nonMetrics, ...segment.metrics });
                        const common = {
                            title: segment.meta?.common.title,
                            ...toDataAttributes(segment.meta?.common.dataset ?? {}),
                        };

                        if (current.isAnimating) {
                            return (
                                <span style={style}>
                                    {Array.from(segment.text).map((character, offset) => (
                                        <Fragment key={offset}>
                                            <span
                                                class={TypewriterStyles.typewriterChar}
                                                style={getAnimationStyle(segment.startIndex + offset)}
                                                onAnimationstart={(event) =>
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

                        const classes = [
                            TypewriterStyles.typewriterChar,
                            isErased && TypewriterStyles.typewriterErased,
                        ];

                        return segment.meta?.anchor ? (
                            <a class={classes} style={style} {...common} {...segment.meta.anchor}>
                                {segment.text}
                            </a>
                        ) : (
                            <span class={classes} style={style} {...common}>
                                {segment.text}
                            </span>
                        );
                    }
                }
            };

            return (
                <div class={TypewriterStyles.typewriterRoot}>
                    <div ref={containerRef} class={TypewriterStyles.typewriterChildrenWrap} aria-hidden="true" inert>
                        {slots.default?.()}
                    </div>

                    {current.segments.length > 0 && (
                        <div class={TypewriterStyles.typewriterTextWrap} style={{ width: `${current.width ?? 0}px` }}>
                            {current.caretIndex === BEFORE_FIRST && renderCaret()}

                            {current.segments.map((segment, index) => (
                                <Fragment key={index}>{renderSegment(segment)}</Fragment>
                            ))}

                            {!current.isAnimating && current.caretIndex !== BEFORE_FIRST && renderCaret()}
                        </div>
                    )}
                </div>
            );
        };
    },
    {
        name: "Typewriter",
        slots: Object as SlotsType<TypewriterSlots>,
        props: declareProps<TypewriterProps>({
            animationName: null,
            animationDurationMs: null,
            animationDelayMs: null,
            initialAnimationDelayMs: null,
            mode: null,
            computeCharacterWeights: null,
            resetAnimationOnLayout: Boolean,
            resetAnimationOnContent: Boolean,
            onMount: null,
            onAnimationEnd: null,
        }),
    },
);
