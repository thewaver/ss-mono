import {
    type CSSProperties,
    Fragment,
    type SlotsType,
    type VNodeChild,
    computed,
    defineComponent,
    nextTick,
    shallowRef,
} from "vue";

import {
    LetterDriverStyles,
    LetterDriverUtils,
    type LetterSegment,
    type LetterState,
    TYPEWRITER_DEFAULTS,
    TypewriterStyles,
    TypewriterUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";
import { setElementVars } from "@vanilla-extract/dynamic";

import { provideLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { useStableList } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { TypewriterController, TypewriterProps, TypewriterSlots } from "./Typewriter.types";

const BEFORE_FIRST = TypewriterUtils.CARET_BEFORE_FIRST;
const NO_PROGRESS = 0;
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
        const progress = useTwoWay(props, "progress", NO_PROGRESS);
        const isPlaying = useTwoWay(props, "playback", true);

        const getComputeAnimationName = () => props.computeAnimationName ?? TYPEWRITER_DEFAULTS.computeAnimationName;
        const getAnimationDurationMs = () => props.animationDurationMs ?? TYPEWRITER_DEFAULTS.animationDurationMs;
        const getAnimationDelayMs = () => props.animationDelayMs ?? TYPEWRITER_DEFAULTS.animationDelayMs;
        const getInitialAnimationDelayMs = () =>
            props.initialAnimationDelayMs ?? TYPEWRITER_DEFAULTS.initialAnimationDelayMs;
        const getMode = () => props.mode ?? TYPEWRITER_DEFAULTS.mode;
        const getIsErasing = () => getMode() === "erase";

        const rootRef = shallowRef<HTMLDivElement>();
        const containerRef = shallowRef<HTMLDivElement>();

        const registry = LetterDriverUtils.createRegistry();
        const registryState = useStore(registry);
        const drivenCharacters = useStore(registry, (state) => state.characters);
        const getIsDriven = () => registryState.value.entries.length > 0;

        const player = TypewriterUtils.createPlayer({
            getContainer: () => containerRef.value,
            getIsDriven,
            getComputeAnimationName,
            getIsPlaying: () => isPlaying.value,
            setProgress: (next) => {
                progress.value = next;
            },
            getResetAnimationOnContent: () => props.resetAnimationOnContent,
            getResetAnimationOnLayout: () => props.resetAnimationOnLayout,
        });

        const state = useStore(player);
        const segments = useStore(player, (current) => current.segments);

        const runDurationMs = computed(() =>
            TypewriterUtils.getRunDurationMs(
                state.value.count,
                getAnimationDelayMs(),
                getInitialAnimationDelayMs(),
                getAnimationDurationMs(),
            ),
        );

        const timeMs = computed(() => progress.value * runDurationMs.value);

        const isAnimating = computed(() =>
            TypewriterUtils.getIsRunning(state.value.count, progress.value, isPlaying.value),
        );

        const getIsErasedNow = () => !isAnimating.value && getIsErasing();

        const startTimesMs = computed(() => {
            const count = state.value.count;

            return TypewriterUtils.computeStartTimes(
                count,
                props.computeCharacterWeights?.(count),
                getIsErasing(),
                getInitialAnimationDelayMs(),
                getAnimationDelayMs(),
            );
        });

        const characters = useStableList(() =>
            getIsDriven() ? drivenCharacters.value : LetterDriverUtils.getCharacters(segments.value),
        );

        const animationNames = useStableList(() => {
            const computeAnimationName = getComputeAnimationName();

            return characters.value.map((character, index) =>
                computeAnimationName(character, index, characters.value.length),
            );
        });

        const hangingIndices = computed(() => LetterDriverUtils.getHangingIndices(segments.value));

        const caretIndex = computed(() =>
            TypewriterUtils.computeCaretIndex(
                startTimesMs.value,
                timeMs.value,
                getIsErasing(),
                !isAnimating.value,
                hangingIndices.value,
            ),
        );

        const controller: TypewriterController = {
            restartAnimation: () => {
                isPlaying.value = true;
                void nextTick(() => player.restart());

                return true;
            },
            update: (cause) => {
                if (!containerRef.value) return false;

                void nextTick(() => player.update(cause));

                return true;
            },
        };

        let previousDrivenCount = 0;

        watchAfterRender([() => drivenCharacters.value], ([driven]) => {
            if (!getIsDriven()) return;

            player.setCount(driven.length, previousDrivenCount ? "content" : "other");
            previousDrivenCount = driven.length;
        });

        let previousRun = { names: animationNames.value, characters: characters.value, mode: getMode() };

        watchAfterRender([() => animationNames.value, getMode], ([names, mode]) => {
            const previous = previousRun;

            previousRun = { names, characters: characters.value, mode };

            if (
                previous.mode !== mode ||
                (previous.names !== names && previous.characters === previousRun.characters)
            ) {
                player.restart();
            }
        });

        watchAfterRender([() => isPlaying.value, () => isAnimating.value], ([isOn, isRunning]) => {
            if (!isOn || !isRunning) return;

            return TypewriterUtils.run({
                getProgress: () => progress.value,
                setProgress: (next) => {
                    progress.value = next;
                },
                getRunDurationMs: () => runDurationMs.value,
                onEnd: () => props.onAnimationEnd?.(),
            });
        });

        watchAfterRender([rootRef, () => timeMs.value], ([root, time]) => {
            if (!root) return;

            setElementVars(root, {
                [LetterDriverStyles.letterDriverTimeVar]: LetterDriverUtils.getTimeValue(time),
            });
        });

        const computeLetterAnimation = (index: number) => ({
            name: animationNames.value[index],
            durationMs: getAnimationDurationMs(),
            delayMs: startTimesMs.value[index],
            direction: getIsErasing() ? ("reverse" as const) : ("normal" as const),
        });

        const getLetterState = (index: number): LetterState =>
            isAnimating.value
                ? { isHidden: false, animation: computeLetterAnimation(index) }
                : { isHidden: getIsErasedNow() };

        provideLetterDriverContext({
            registry,
            getLetterState,
            getIsAnimating: () => isAnimating.value,
            getIsHidden: getIsErasedNow,
            getCaretIndex: () => caretIndex.value,
            renderCaret: slots.renderCaret ? () => callSlot(slots.renderCaret, undefined) : undefined,
        });

        watchAfterRender([], () => {
            props.onMount?.(controller);

            const container = containerRef.value;

            return container ? player.observe(container) : undefined;
        });

        return () => {
            const current = state.value;
            const isRunning = isAnimating.value;
            const isErased = !isRunning && getIsErasing();
            const caret = caretIndex.value;

            const getAnimationStyle = (index: number): CSSProperties | undefined =>
                isRunning
                    ? toVueStyle(
                          LetterDriverUtils.computeAnimationStyle(
                              computeLetterAnimation(index),
                              LetterDriverStyles.letterDriverTimeVar,
                          ),
                      )
                    : undefined;

            const renderCaret = () => callSlot(slots.renderCaret, undefined);

            const renderCaretAfter = (index: number) => isRunning && caret === index && renderCaret();

            const renderSegment = (segment: LetterSegment): VNodeChild => {
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
                        const style = toVueStyle({ ...segment.nonMetrics, ...segment.metrics });
                        const common = {
                            title: segment.meta?.common.title,
                            ...toDataAttributes(segment.meta?.common.dataset ?? {}),
                        };

                        if (isRunning) {
                            return (
                                <span style={style}>
                                    {Array.from(segment.text).map((character, offset) => (
                                        <Fragment key={offset}>
                                            <span
                                                class={TypewriterStyles.typewriterChar}
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
                <div ref={rootRef} class={TypewriterStyles.typewriterRoot}>
                    <div
                        ref={containerRef}
                        class={getIsDriven() ? undefined : TypewriterStyles.typewriterChildrenWrap}
                        aria-hidden={getIsDriven() ? undefined : "true"}
                        inert={!getIsDriven()}
                    >
                        {slots.default?.()}
                    </div>

                    {!getIsDriven() && current.segments.length > 0 && (
                        <div class={TypewriterStyles.typewriterTextWrap} style={{ width: `${current.width ?? 0}px` }}>
                            {caret === BEFORE_FIRST && renderCaret()}

                            {current.segments.map((segment, index) => (
                                <Fragment key={index}>{renderSegment(segment)}</Fragment>
                            ))}

                            {!isRunning && caret !== BEFORE_FIRST && renderCaret()}
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
            "computeAnimationName": null,
            "animationDurationMs": null,
            "animationDelayMs": null,
            "initialAnimationDelayMs": null,
            "mode": null,
            "computeCharacterWeights": null,
            "resetAnimationOnLayout": Boolean,
            "resetAnimationOnContent": Boolean,
            "progress": null,
            "onUpdate:progress": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "onMount": null,
            "onAnimationEnd": null,
        }),
    },
);
