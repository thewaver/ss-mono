import { For, Index, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";
import type { ParentProps } from "solid-js";

import { TYPEWRITER_DEFAULTS, TypewriterUtils, TypewriterStyles as styles } from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import { accessStore } from "../../Utils/storeUtils";
import type { TypewriterProps } from "./TypewriterSolid.types";

const BEFORE_FIRST = TypewriterUtils.CARET_BEFORE_FIRST;

export const Typewriter = (props: ParentProps<TypewriterProps>) => {
    const [getContainerRef, setContainerRef] = createSignal<HTMLElement>();

    const getAnimationName = createMemo(() => access(props.animationName) ?? TYPEWRITER_DEFAULTS.animationName);

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

    const player = TypewriterUtils.createPlayer({
        getContainer: getContainerRef,
        getAnimationDurationMs,
        getAnimationDelayMs,
        getInitialAnimationDelayMs,
        getIsErasing,
        getResetAnimationOnContent: () => access(props.resetAnimationOnContent),
        getResetAnimationOnLayout: () => access(props.resetAnimationOnLayout),
        onAnimationEnd: () => props.onAnimationEnd?.(),
    });

    onCleanup(player.stop);

    const getIndexedSegments = accessStore(player, (state) => state.segments);

    const getAnimatedElementCount = accessStore(player, (state) => state.count);

    const getIsAnimating = accessStore(player, (state) => state.isAnimating);

    const getCaretIndex = accessStore(player, (state) => state.caretIndex);

    const getWidth = accessStore(player, (state) => state.width);

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

    const getAnimationBase = createMemo(() =>
        getIsAnimating()
            ? {
                  name: getAnimationName(),
                  durationMs: getAnimationDurationMs(),
                  direction: getIsErasing() ? "reverse" : "normal",
                  startTimesMs: getStartTimesMs(),
              }
            : undefined,
    );

    const handleAnimationStart = (event: AnimationEvent, index: number) => {
        if (event.target !== event.currentTarget) return;

        player.reportCharacterStart(index);
    };

    const controller = createMemo(() => ({
        restartAnimation: () => {
            player.restart();

            return true;
        },
        update: player.update,
    }));

    createEffect(on([getAnimationName, getMode], () => player.restart(), { defer: true }));

    onMount(() => {
        props.onMount?.(controller());

        const containerRef = getContainerRef();

        if (!containerRef) return;

        onCleanup(player.observe(containerRef));
    });

    return (
        <div class={styles.typewriterRoot}>
            <div ref={setContainerRef} class={styles.typewriterChildrenWrap} aria-hidden="true" inert>
                {props.children}
            </div>

            {!!getIndexedSegments().length && (
                <div class={styles.typewriterTextWrap} style={{ width: `${getWidth() ?? 0}px` }}>
                    <Show when={getCaretIndex() === BEFORE_FIRST}>{props.renderCaret?.()}</Show>

                    <For each={getIndexedSegments()}>
                        {(segment) => {
                            const getAnimationStyle = (startIndex: number) => {
                                const base = getAnimationBase();

                                if (!base) return undefined;

                                return {
                                    "animation-name": base.name,
                                    "animation-duration": `${base.durationMs}ms`,
                                    "animation-delay": `${base.startTimesMs[startIndex]}ms`,
                                    "animation-direction": base.direction,
                                };
                            };

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
                                                onAnimationStart={(event) =>
                                                    handleAnimationStart(event, segment.startIndex)
                                                }
                                            >
                                                {segment.element}
                                            </span>

                                            {renderCaretAfter(segment.startIndex)}
                                        </>
                                    );
                                }
                                case "linebreak":
                                    return (
                                        <>
                                            <br
                                                style={getAnimationStyle(segment.startIndex)}
                                                onAnimationStart={(event) =>
                                                    handleAnimationStart(event, segment.startIndex)
                                                }
                                            />

                                            {renderCaretAfter(segment.startIndex)}
                                        </>
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
                                                                    onAnimationStart={(event) =>
                                                                        handleAnimationStart(
                                                                            event,
                                                                            segment.startIndex + charIndex,
                                                                        )
                                                                    }
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

                    <Show when={!getIsAnimating() && getCaretIndex() !== BEFORE_FIRST}>{props.renderCaret?.()}</Show>
                </div>
            )}
        </div>
    );
};
