import { For, Index, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";
import type { ParentProps } from "solid-js";

import {
    LetterDriverStyles,
    LetterDriverUtils,
    type LetterState,
    TYPEWRITER_DEFAULTS,
    TypewriterUtils,
    TypewriterStyles as styles,
} from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { LetterDriverContextProvider } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import type { LetterDriverContextType } from "../../../Abstracts/LetterDriver/LetterDriverSolid.context.types";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { TypewriterProps } from "./TypewriterSolid.types";

const BEFORE_FIRST = TypewriterUtils.CARET_BEFORE_FIRST;
const NO_PROGRESS = 0;

export const Typewriter = (props: ParentProps<TypewriterProps>) => {
    const [getContainerRef, setContainerRef] = createSignal<HTMLElement>();

    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(() => props.progress, NO_PROGRESS);
    const [getIsPlaying, setIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);

    const getComputeAnimationName = () => props.computeAnimationName ?? TYPEWRITER_DEFAULTS.computeAnimationName;

    const getAnimationDurationMs = createMemo(
        () => access(props.animationDurationMs) ?? TYPEWRITER_DEFAULTS.animationDurationMs,
    );

    const getAnimationDelayMs = createMemo(
        () => access(props.animationDelayMs) ?? TYPEWRITER_DEFAULTS.animationDelayMs,
    );

    const getInitialAnimationDelayMs = createMemo(
        () => access(props.initialAnimationDelayMs) ?? TYPEWRITER_DEFAULTS.initialAnimationDelayMs,
    );

    const getMode = createMemo(() => access(props.mode) ?? TYPEWRITER_DEFAULTS.mode);

    const getIsErasing = createMemo(() => getMode() === "erase");

    const registry = LetterDriverUtils.createRegistry();

    const getIsDriven = accessStore(registry, (state) => state.entries.length > 0);

    const getDrivenCharacters = accessStore(registry, (state) => state.characters);

    const player = TypewriterUtils.createPlayer({
        getContainer: getContainerRef,
        getIsDriven,
        getComputeAnimationName: () => untrack(getComputeAnimationName),
        getIsPlaying: () => untrack(getIsPlaying),
        setProgress,
        getResetAnimationOnContent: () => access(props.resetAnimationOnContent),
        getResetAnimationOnLayout: () => access(props.resetAnimationOnLayout),
    });

    const getIndexedSegments = accessStore(player, (state) => state.segments);

    const getAnimatedElementCount = accessStore(player, (state) => state.count);

    const getWidth = accessStore(player, (state) => state.width);

    const getRunDurationMs = createMemo(() =>
        TypewriterUtils.getRunDurationMs(
            getAnimatedElementCount(),
            getAnimationDelayMs(),
            getInitialAnimationDelayMs(),
            getAnimationDurationMs(),
        ),
    );

    const getTimeMs = () => getProgress() * getRunDurationMs();

    const getIsAnimating = createMemo(() =>
        TypewriterUtils.getIsRunning(getAnimatedElementCount(), getProgress(), getIsPlaying()),
    );

    const getIsErased = () => !getIsAnimating() && getIsErasing();

    const getStartTimesMs = createMemo(() => {
        const count = getAnimatedElementCount();

        return TypewriterUtils.computeStartTimes(
            count,
            props.computeCharacterWeights?.(count),
            getIsErasing(),
            getInitialAnimationDelayMs(),
            getAnimationDelayMs(),
        );
    });

    const getCharacters = createMemo(() =>
        getIsDriven() ? getDrivenCharacters() : LetterDriverUtils.getCharacters(getIndexedSegments()),
    );

    const getAnimationNames = createMemo(() => {
        const characters = getCharacters();
        const computeAnimationName = getComputeAnimationName();

        return characters.map((character, index) => computeAnimationName(character, index, characters.length));
    });

    const getCaretIndex = createMemo(() =>
        TypewriterUtils.computeCaretIndex(getStartTimesMs(), getTimeMs(), getIsErasing(), !getIsAnimating()),
    );

    const getRootStyle = () =>
        assignInlineVars({ [LetterDriverStyles.letterDriverTimeVar]: LetterDriverUtils.getTimeValue(getTimeMs()) });

    const getAnimationStyle = (index: number) =>
        getIsAnimating()
            ? LetterDriverUtils.computeAnimationStyle(
                  {
                      name: getAnimationNames()[index],
                      durationMs: getAnimationDurationMs(),
                      delayMs: getStartTimesMs()[index],
                      direction: getIsErasing() ? "reverse" : "normal",
                  },
                  LetterDriverStyles.letterDriverTimeVar,
              )
            : undefined;

    const controller = createMemo(() => ({
        restartAnimation: () => {
            setIsPlaying(true);
            player.restart();

            return true;
        },
        update: player.update,
    }));

    let namedCharacters = untrack(getCharacters);

    createEffect(
        on(
            getAnimationNames,
            () => {
                const characters = untrack(getCharacters);

                if (characters === namedCharacters) player.restart();

                namedCharacters = characters;
            },
            { defer: true },
        ),
    );

    createEffect(on(getMode, () => player.restart(), { defer: true }));

    createEffect(
        on(getDrivenCharacters, (characters, previous) => {
            if (!getIsDriven()) return;

            player.setCount(characters.length, previous?.length ? "content" : "other");
        }),
    );

    createEffect(() => {
        if (!getIsPlaying() || !getIsAnimating()) return;

        onCleanup(
            TypewriterUtils.run({
                getProgress: () => untrack(getProgress),
                setProgress,
                getRunDurationMs: () => untrack(getRunDurationMs),
                onEnd: () => props.onAnimationEnd?.(),
            }),
        );
    });

    const getLetterState = (index: number): LetterState => {
        if (!getIsAnimating()) return { isHidden: getIsErased() };

        return {
            isHidden: false,
            animation: {
                name: getAnimationNames()[index],
                durationMs: getAnimationDurationMs(),
                delayMs: getStartTimesMs()[index],
                direction: getIsErasing() ? "reverse" : "normal",
            },
        };
    };

    const driver: LetterDriverContextType = {
        registry,
        getLetterState,
        getIsAnimating,
        getIsHidden: getIsErased,
        getCaretIndex,
        renderCaret: props.renderCaret && (() => props.renderCaret?.()),
    };

    onMount(() => {
        props.onMount?.(controller());

        const containerRef = getContainerRef();

        if (!containerRef) return;

        onCleanup(player.observe(containerRef));
    });

    return (
        <LetterDriverContextProvider value={driver}>
            <div class={styles.typewriterRoot} style={getRootStyle()}>
                <div
                    ref={setContainerRef}
                    class={getIsDriven() ? undefined : styles.typewriterChildrenWrap}
                    aria-hidden={getIsDriven() ? undefined : "true"}
                    inert={getIsDriven() ? undefined : true}
                >
                    {props.children}
                </div>

                {!getIsDriven() && !!getIndexedSegments().length && (
                    <div class={styles.typewriterTextWrap} style={{ width: `${getWidth() ?? 0}px` }}>
                        <Show when={getCaretIndex() === BEFORE_FIRST}>{props.renderCaret?.()}</Show>

                        <For each={getIndexedSegments()}>
                            {(segment) => {
                                const renderCaretAfter = (index: number) => (
                                    <Show when={getIsAnimating() && getCaretIndex() === index}>
                                        {props.renderCaret?.()}
                                    </Show>
                                );

                                switch (segment.type) {
                                    case "atomic": {
                                        return (
                                            <>
                                                <span
                                                    class={
                                                        segment.isBlockLike
                                                            ? styles.typewriterBlockLikeAtomic
                                                            : styles.typewriterChar
                                                    }
                                                    classList={{ [styles.typewriterErased]: getIsErased() }}
                                                    style={getAnimationStyle(segment.startIndex)}
                                                >
                                                    {segment.element}
                                                </span>

                                                {renderCaretAfter(segment.startIndex)}
                                            </>
                                        );
                                    }
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
                                        const style = { ...segment.nonMetrics, ...segment.metrics };

                                        return (
                                            <>
                                                {getIsAnimating() ? (
                                                    <span style={style}>
                                                        <Index each={Array.from(segment.text)}>
                                                            {(getChar, charIndex) => (
                                                                <>
                                                                    <span
                                                                        class={styles.typewriterChar}
                                                                        style={getAnimationStyle(
                                                                            segment.startIndex + charIndex,
                                                                        )}
                                                                    >
                                                                        {getChar()}
                                                                    </span>

                                                                    {renderCaretAfter(segment.startIndex + charIndex)}
                                                                </>
                                                            )}
                                                        </Index>
                                                    </span>
                                                ) : segment.meta?.anchor ? (
                                                    <a
                                                        class={styles.typewriterChar}
                                                        classList={{ [styles.typewriterErased]: getIsErased() }}
                                                        style={style}
                                                        {...segment.meta?.common}
                                                        {...segment.meta?.anchor}
                                                    >
                                                        {segment.text}
                                                    </a>
                                                ) : (
                                                    <span
                                                        class={styles.typewriterChar}
                                                        classList={{ [styles.typewriterErased]: getIsErased() }}
                                                        style={style}
                                                        {...segment.meta?.common}
                                                    >
                                                        {segment.text}
                                                    </span>
                                                )}
                                            </>
                                        );
                                    }
                                }
                            }}
                        </For>

                        <Show when={!getIsAnimating() && getCaretIndex() !== BEFORE_FIRST}>
                            {props.renderCaret?.()}
                        </Show>
                    </div>
                )}
            </div>
        </LetterDriverContextProvider>
    );
};
